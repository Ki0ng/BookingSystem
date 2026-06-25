import prisma from '../config/db.config';
import { Booking, Prisma, BookingStatus } from '@prisma/client';

export class BookingRepository {
  async findById(bookingId: string): Promise<any | null> {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: { include: { hotel: true } }, user: true }
    });
  }

  async findFirstByUserId(userId: string): Promise<Booking | null> {
    return prisma.booking.findFirst({ where: { userId } });
  }

  async findManyByUserId(userId: string): Promise<any[]> {
    return prisma.booking.findMany({
      where: { userId },
      include: { room: { include: { hotel: true } } }
    });
  }

  async countOverlapping(roomId: string, checkIn: Date, checkOut: Date): Promise<number> {
    return prisma.booking.count({
      where: {
        roomId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        checkIn: { lt: checkOut },
        checkOut: { gt: checkIn }
      }
    });
  }

  async create(bookingData: Prisma.BookingUncheckedCreateInput, transactionClient?: Prisma.TransactionClient): Promise<Booking> {
    const client = transactionClient || prisma;
    return client.booking.create({
      data: bookingData
    });
  }

  async updateStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    return prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });
  }

  async findManagerBookings(managerId: string, skip: number, take: number): Promise<[any[], number]> {
    return Promise.all([
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
        take
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
  }
}
