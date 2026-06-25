import prisma from '../config/db.config';
import { redisUtil } from '../utils/redis.util';
import logger from '../utils/logger';
import { HotelRepository } from '../repositories/hotel.repository';
import { BookingRepository } from '../repositories/booking.repository';
import { HotelUtils } from '../utils/hotel.utils';
import { CACHE_PREFIX, CACHE_TTL } from '../config/constants';

export class HotelService {
  private readonly hotelRepository = new HotelRepository();
  private readonly bookingRepository = new BookingRepository();

  getAllHotels = async (searchCriteria: any) => {
    const { checkIn, checkOut, guests, flexibility = 0 } = searchCriteria;
    
    const queryFilters = this.buildSearchFilters(searchCriteria);
    const relatedDataToInclude = this.buildSearchInclude(guests);

    const hotels = await this.hotelRepository.findMany(queryFilters, relatedDataToInclude);

    if (checkIn && checkOut) {
      return this.filterHotelsByAvailability(hotels, checkIn, checkOut, flexibility);
    }

    return hotels;
  };

  private buildSearchFilters = (searchCriteria: any) => {
    const { location, minPrice, maxPrice, rating, guests } = searchCriteria;
    const queryFilters: any = {
      address: location ? { contains: location, mode: 'insensitive' } : undefined,
      average_rating: rating ? { gte: rating } : undefined,
    };

    if (guests || minPrice || maxPrice) {
      queryFilters.rooms = {
        some: {
          capacity: guests ? { gte: guests } : undefined,
          base_price: {
            gte: minPrice || 0,
            lte: maxPrice || 9999999,
          }
        }
      };
    }
    return queryFilters;
  };

  private buildSearchInclude = (guests: number) => {
    return {
      images: true,
      rooms: {
        where: guests ? { capacity: { gte: guests } } : undefined,
        select: { base_price: true, capacity: true, quantity: true, id: true },
        orderBy: { base_price: 'asc' as any }
      },
      _count: { select: { reviews: true } }
    };
  };

  private filterHotelsByAvailability = async (hotels: any[], checkIn: string, checkOut: string, flexibility: number) => {
    const flexibilityWindows = HotelUtils.generateFlexibilityWindows(new Date(checkIn), new Date(checkOut), flexibility);

    // Collect all room IDs across all candidate hotels
    const roomIds = hotels.flatMap(h => h.rooms.map((r: any) => r.id));
    if (roomIds.length === 0) return [];

    // Retrieve all bookings that overlap with any of the flexibility windows for these room IDs in one query
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        roomId: { in: roomIds },
        status: { in: ['CONFIRMED', 'PENDING'] },
        OR: flexibilityWindows.map(window => ({
          checkIn: { lt: window.out },
          checkOut: { gt: window.in }
        }))
      },
      select: {
        roomId: true,
        checkIn: true,
        checkOut: true
      }
    });

    const availableHotels: any[] = [];

    for (const hotel of hotels) {
      let isHotelAvailable = false;

      // A hotel is available if at least one window has an available room
      for (const window of flexibilityWindows) {
        let anyRoomAvailableInWindow = false;

        for (const room of hotel.rooms) {
          // Count overlapping bookings for this room and window in memory
          const overlappingCount = overlappingBookings.filter(b =>
            b.roomId === room.id &&
            b.checkIn < window.out &&
            b.checkOut > window.in
          ).length;

          if (room.quantity - overlappingCount > 0) {
            anyRoomAvailableInWindow = true;
            break; // Found an available room type for this window, no need to check other rooms
          }
        }

        if (anyRoomAvailableInWindow) {
          isHotelAvailable = true;
          break; // Found a window in which the hotel is available, no need to check other windows
        }
      }

      if (isHotelAvailable) {
        availableHotels.push(hotel);
      }
    }

    return availableHotels;
  };

  getHotelsByOwner = async (ownerId: string) => {
    return this.hotelRepository.findByOwner(ownerId);
  };

  getHotelById = async (id: string) => {
    const cacheKey = `${CACHE_PREFIX.HOTEL}${id}`;
    const cachedData = await redisUtil.get<any>(cacheKey);
    if (cachedData) return cachedData;

    const hotel = await this.hotelRepository.findUnique(id, {
      images: true,
      rooms: { include: { images: true } },
      reviews: { include: { user: { select: { name: true, email: true, avatar: true } } } },
      amenities: true
    });

    if (hotel) await redisUtil.setEx(cacheKey, CACHE_TTL.HOTEL_DETAILS, hotel);
    return hotel;
  };

  createHotel = async (ownerId: string, hotelData: any) => {
    const { images, amenities, base_price, adults, children, quantity, ...hotelDetails } = hotelData;
    
    const hotel = await this.hotelRepository.create({
      ...hotelDetails,
      ownerId,
      location_lat: hotelDetails.location_lat || 0,
      location_lng: hotelDetails.location_lng || 0,
      images: images ? { create: images.map((url: string) => ({ url })) } : undefined,
      amenities: amenities ? {
        connectOrCreate: amenities.map((name: string) => ({ where: { name }, create: { name } }))
      } : undefined
    });

    if (base_price) {
      const capacity = (adults || 2) + (children || 0);
      await this.createDefaultRoom(hotel.id, parseFloat(base_price), capacity, quantity || 1, adults || 2, children || 0);
    }

    await redisUtil.setEx(`${CACHE_PREFIX.HOTEL}${hotel.id}`, CACHE_TTL.HOTEL_DETAILS, hotel);
    return hotel;
  };

  private createDefaultRoom = async (hotelId: string, basePrice: number, capacity: number, quantity: number, adults: number, children: number) => {
    await prisma.room.create({
      data: {
        hotelId,
        room_type: 'Standard Room',
        base_price: basePrice,
        quantity: quantity,
        capacity: capacity,
        status: 'AVAILABLE',
        metadata: { adults, children } as any,
      }
    });
  };

  updateHotel = async (id: string, hotelUpdates: any) => {
    const { images, amenities, ...hotelFields } = hotelUpdates;

    await prisma.$transaction(async (transactionClient) => {
      if (images) await this.hotelRepository.deleteImages(id, transactionClient);
      if (amenities) await this.hotelRepository.clearAmenities(id, transactionClient);

      return await this.hotelRepository.update(id, {
        ...hotelFields,
        images: images ? { create: images.map((url: string) => ({ url })) } : undefined,
        amenities: amenities ? {
          connectOrCreate: amenities.map((name: string) => ({ where: { name }, create: { name } }))
        } : undefined
      }, transactionClient);
    });

    await redisUtil.del(`${CACHE_PREFIX.HOTEL}${id}`);
  };

  deleteHotel = async (id: string) => {
    await redisUtil.del(`${CACHE_PREFIX.HOTEL}${id}`);
    return this.hotelRepository.delete(id);
  };
}

export const hotelService = new HotelService();
