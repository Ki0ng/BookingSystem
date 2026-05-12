import prisma from '../config/db.config';
import { Prisma, Booking } from '@prisma/client';
import { CreateBookingDTO, BookingWithDetails } from '../types/booking.types';
import { getIO } from '../config/socket.config';

export class BookingService {
  createBooking = async (userId: string, data: CreateBookingDTO): Promise<Booking> => {
    const { roomId, checkIn, checkOut } = data;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const booking = await prisma.$transaction(async (tx) => {
      // Find room to get its total quantity and base price
      const room = await tx.room.findUnique({
        where: { id: roomId },
        include: { hotel: true }
      });

      if (!room) throw new Error("Room not found");
      if (room.status !== 'AVAILABLE') throw new Error("Room is not available");
      if (room.hotel.ownerId === userId) throw new Error("Owner cannot book their own property");

      // Availability Logic: Check overlapping bookings
      const overlappingBookings = await tx.booking.count({
        where: {
          roomId: roomId,
          status: { in: ['CONFIRMED', 'PENDING'] }, 
          checkIn: { lt: checkOutDate },
          checkOut: { gt: checkInDate }
        }
      });

      if (room.quantity - overlappingBookings <= 0) {
        throw new Error("No rooms available for the selected dates");
      }

      // Calculate total price
      const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
      const totalPrice = room.base_price * Math.max(days, 1);

      // Create Booking
      return await tx.booking.create({
        data: {
          userId,
          roomId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          totalPrice,
          status: 'CONFIRMED'
        },
        include: { 
          room: { include: { hotel: true } }, 
          user: { select: { name: true, email: true, avatar: true } } 
        }
      });
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable 
    });

    // Notify Manager via Socket
    try {
      const io = getIO();
      const managerId = (booking.room as any).hotel.ownerId;
      io.to(`manager_${managerId}`).emit('new_booking', booking);
    } catch (e) {}

    return booking;
  };

  getUserBookings = async (userId: string): Promise<any[]> => {
    return await prisma.booking.findMany({
      where: { userId },
      include: { room: { include: { hotel: true } } }
    });
  };

  getManagerBookings = async (managerId: string, query: any = {}): Promise<{ data: any[], pagination: any }> => {
    const page = parseInt(query.page) || 1;
    const limit = query.limit === 'all' ? 10000 : (parseInt(query.limit) || 10);
    const skip = query.limit === 'all' ? 0 : (page - 1) * limit;
    const take = limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: {
          room: {
            hotel: {
              ownerId: managerId
            }
          }
        },
        include: {
          room: { include: { hotel: true } },
          user: { select: { name: true, email: true, avatar: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.booking.count({
        where: {
          room: {
            hotel: {
              ownerId: managerId
            }
          }
        }
      })
    ]);

    return {
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  };

  getBookingDetails = async (id: string): Promise<BookingWithDetails | null> => {
    return await prisma.booking.findUnique({
      where: { id },
      include: { room: { include: { hotel: true } }, user: true }
    });
  };

  cancelBooking = async (id: string): Promise<Booking> => {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { room: { include: { hotel: true } } }
    });

    // Notify Manager via Socket
    try {
      const io = getIO();
      const managerId = (booking.room as any).hotel.ownerId;
      io.to(`manager_${managerId}`).emit('booking_updated', booking);
    } catch (e) {}

    return booking;
  };
}
