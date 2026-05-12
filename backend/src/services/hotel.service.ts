import { PrismaClient, Hotel } from '@prisma/client';
import { redisUtil } from '../utils/redis.util';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export const hotelService = {
  // Lấy danh sách khách sạn với bộ lọc
  getAllHotels: async (filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    flexibility?: number;
  }) => {
    const { location, minPrice, maxPrice, rating, checkIn, checkOut, guests, flexibility = 0 } = filters;
    logger.info(`[SEARCH] Filters: ${JSON.stringify(filters)}`);

    // Base where clause
    const where: any = {
      address: location ? { contains: location, mode: 'insensitive' } : undefined,
      average_rating: rating ? { gte: rating } : undefined,
    };
    logger.info(`[SEARCH] Where: ${JSON.stringify(where)}`);

    // Filter by capacity and price
    if (guests || minPrice || maxPrice) {
      where.rooms = {
        some: {
          capacity: guests ? { gte: guests } : undefined,
          base_price: {
            gte: minPrice || 0,
            lte: maxPrice || 9999999,
          },
          // status: 'AVAILABLE' // Temporarily relaxed for testing
        }
      };
    }

    // Advanced availability check if dates are provided
    // This is a simplified version. For true availability, we'd need to check every room's quantity vs overlapping bookings.
    // For now, let's filter by capacity and price first.

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        images: true,
        rooms: {
          where: {
            capacity: guests ? { gte: guests } : undefined,
          },
          select: {
            base_price: true,
            capacity: true,
            quantity: true,
            id: true,
          },
          orderBy: {
            base_price: 'asc'
          }
        },
        _count: {
          select: { reviews: true }
        }
      }
    });

    // If dates are provided, we filter out hotels that don't have any room with availability
    if (checkIn && checkOut) {
      const baseCheckIn = new Date(checkIn);
      const baseCheckOut = new Date(checkOut);
      const durationDays = Math.ceil((baseCheckOut.getTime() - baseCheckIn.getTime()) / (1000 * 3600 * 24));

      // Generate Windows based on flexibility
      const windows: { in: Date, out: Date }[] = [{ in: baseCheckIn, out: baseCheckOut }];
      logger.info(`[SEARCH] Base window: ${baseCheckIn.toISOString()} - ${baseCheckOut.toISOString()}, duration: ${durationDays} days`);
      
      if (flexibility > 0) {
        const offsets = Array.from({ length: flexibility }, (_, i) => i + 1);
        offsets.forEach(offset => {
          // Window -offset
          const winInMinus = new Date(baseCheckIn);
          winInMinus.setDate(winInMinus.getDate() - offset);
          const winOutMinus = new Date(winInMinus);
          winOutMinus.setDate(winOutMinus.getDate() + durationDays);
          windows.push({ in: winInMinus, out: winOutMinus });

          // Window +offset
          const winInPlus = new Date(baseCheckIn);
          winInPlus.setDate(winInPlus.getDate() + offset);
          const winOutPlus = new Date(winInPlus);
          winOutPlus.setDate(winOutPlus.getDate() + durationDays);
          windows.push({ in: winInPlus, out: winOutPlus });
        });
      }
      logger.info(`[SEARCH] Total windows generated: ${windows.length}`);

      const finalHotels: Hotel[] = [];

      for (const hotel of hotels) {
        let isHotelAvailable = false;

        // Check each flexibility window
        for (const window of windows) {
          const roomAvailability = await Promise.all(hotel.rooms.map(async (room) => {
            const overlappingBookings = await prisma.booking.count({
              where: {
                roomId: room.id,
                status: { in: ['CONFIRMED', 'PENDING'] },
                checkIn: { lt: window.out },
                checkOut: { gt: window.in }
              }
            });
            return (room.quantity - overlappingBookings) > 0;
          }));

          if (roomAvailability.some(available => available)) {
            isHotelAvailable = true;
            break; // Found a valid window, no need to check others
          }
        }

        if (isHotelAvailable) {
          finalHotels.push(hotel as any);
        } else {
          logger.info(`[SEARCH] Hotel ${hotel.name} filtered out - no availability in any window`);
        }
      }

      logger.info(`[SEARCH] Found ${finalHotels.length} hotels after availability check`);
      return finalHotels;
    }


    return hotels;
  },

  getHotelsByOwner: async (ownerId: string) => {
    return await prisma.hotel.findMany({
      where: { ownerId },
      include: {
        images: true,
        rooms: {
          include: {
            images: true
          }
        },
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  getHotelById: async (id: string) => {
    const cacheKey = `hotel:v2:${id}`;
    const cachedData = await redisUtil.get<any>(cacheKey);
    if (cachedData) {
      logger.info(`cache hit for hotel:${cacheKey}`);
      return cachedData;
    }
    logger.info(`cache miss for hotel:${id}`);
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        images: true,
        rooms: {
          include: {
            images: true
          }
        },
        reviews: {
          include: {
            user: {
              select: { name: true, email: true, avatar: true }
            }
          }
        },
        amenities: true
      }
    });
    if (hotel) {
      await redisUtil.setEx(cacheKey, 900, hotel);
      logger.info(`cache set for hotel:${cacheKey}`);
    }
    return hotel;
  },

  createHotel: async (ownerId: string, data: any) => {
    const { images, amenities, base_price, adults, children, quantity, ...rest } = data;
    const hotel = await prisma.hotel.create({
      data: {
        ...rest,
        ownerId,
        location_lat: rest.location_lat || 0,
        location_lng: rest.location_lng || 0,
        images: images ? {
          create: images.map((url: string) => ({ url }))
        } : undefined,
        amenities: amenities ? {
          connectOrCreate: amenities.map((name: string) => ({
            where: { name },
            create: { name }
          }))
        } : undefined
      },
      include: { images: true, amenities: true }
    });

    // Create a default room if base_price is provided
    if (base_price) {
      await prisma.room.create({
        data: {
          hotelId: hotel.id,
          room_type: 'Standard Room',
          base_price: parseFloat(base_price),
          quantity: quantity || 1,
          capacity: (adults || 2) + (children || 0),
          status: 'AVAILABLE',
          metadata: {
            adults: adults || 2,
            children: children || 0
          },
        }
      });
    }
    const cacheKey = `hotel:v2:${hotel.id}`;
    await redisUtil.setEx(cacheKey, 900, hotel);
    return hotel;
  },

  updateHotel: async (id: string, data: any) => {
    const { images, amenities, ...rest } = data;

    // 1. Xử lý Images
    if (images) {
      await prisma.image.deleteMany({ where: { hotelId: id } });
    }

    // 2. Xử lý Amenities
    if (amenities) {
      await prisma.hotel.update({
        where: { id },
        data: { amenities: { set: [] } }
      });
    }

    // 3. Thực hiện update dữ liệu chính
    const updatedHotel = await prisma.hotel.update({
      where: { id },
      data: {
        ...rest,
        images: images ? {
          create: images.map((url: string) => ({ url }))
        } : undefined,
        amenities: amenities ? {
          connectOrCreate: amenities.map((name: string) => ({
            where: { name },
            create: { name }
          }))
        } : undefined
      },
      include: { images: true, amenities: true }
    });

    // 🚀 BƯỚC QUAN TRỌNG: Xóa Cache cũ ngay sau khi update thành công
    // Lần sau khi ai đó xem khách sạn này, hệ thống sẽ tự động query DB 
    // để lấy bản mới nhất và lưu lại vào Cache.
    await redisUtil.del(`hotel:v2:${id}`);

    return updatedHotel;
  },

  deleteHotel: async (id: string) => {
    // 🚀 BƯỚC QUAN TRỌNG: Xóa Cache trước khi xóa trong DB
    await redisUtil.del(`hotel:v2:${id}`);

    return await prisma.hotel.delete({
      where: { id }
    });
  }
};
