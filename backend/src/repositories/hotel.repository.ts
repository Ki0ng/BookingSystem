import prisma from '../config/db.config';
import { Hotel, Prisma } from '@prisma/client';

export class HotelRepository {
  async findMany(queryFilters: any, relatedData: any): Promise<any[]> {
    return prisma.hotel.findMany({ where: queryFilters, include: relatedData });
  }

  async findUnique(hotelId: string, relatedData: any): Promise<any | null> {
    return prisma.hotel.findUnique({ where: { id: hotelId }, include: relatedData });
  }

  async findById(hotelId: string): Promise<Hotel | null> {
    return prisma.hotel.findUnique({ where: { id: hotelId } });
  }

  async findByOwner(ownerId: string): Promise<any[]> {
    return prisma.hotel.findMany({
      where: { ownerId },
      include: {
        images: true,
        rooms: { include: { images: true } },
        _count: { select: { reviews: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(hotelData: Prisma.HotelUncheckedCreateInput, transactionClient?: Prisma.TransactionClient): Promise<Hotel> {
    const client = transactionClient || prisma;
    return client.hotel.create({
      data: hotelData
    });
  }

  async update(hotelId: string, hotelUpdateData: Prisma.HotelUpdateInput, transactionClient?: Prisma.TransactionClient): Promise<Hotel> {
    const client = transactionClient || prisma;
    return client.hotel.update({
      where: { id: hotelId },
      data: hotelUpdateData
    });
  }

  async delete(hotelId: string): Promise<Hotel> {
    return prisma.hotel.delete({ where: { id: hotelId } });
  }

  async findAll(): Promise<any[]> {
    return prisma.hotel.findMany({
      include: { owner: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async deleteImages(hotelId: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx || prisma;
    await client.image.deleteMany({ where: { hotelId } });
  }

  async clearAmenities(hotelId: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx || prisma;
    await client.hotel.update({
      where: { id: hotelId },
      data: { amenities: { set: [] } }
    });
  }
}
