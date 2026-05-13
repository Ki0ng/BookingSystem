import prisma from '../config/db.config';
import { Room, Prisma } from '@prisma/client';

export class RoomRepository {
  async findById(roomId: string): Promise<any | null> {
    return prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true, images: true }
    });
  }

  async findManyByHotelId(hotelId: string): Promise<any[]> {
    return prisma.room.findMany({
      where: { hotelId },
      include: { images: true }
    });
  }

  async create(roomData: Prisma.RoomUncheckedCreateInput, transactionClient?: Prisma.TransactionClient): Promise<any> {
    const client = transactionClient || prisma;
    return client.room.create({
      data: roomData,
      include: { images: true }
    });
  }

  async update(roomId: string, roomUpdates: Prisma.RoomUpdateInput, transactionClient?: Prisma.TransactionClient): Promise<any> {
    const client = transactionClient || prisma;
    return client.room.update({
      where: { id: roomId },
      data: roomUpdates,
      include: { images: true }
    });
  }

  async delete(roomId: string): Promise<Room> {
    return prisma.room.delete({ where: { id: roomId } });
  }

  async deleteImagesByRoomId(roomId: string, transactionClient?: Prisma.TransactionClient): Promise<void> {
    const client = transactionClient || prisma;
    await client.image.deleteMany({ where: { roomId } });
  }

  async createManyImages(images: { url: string; roomId: string }[], transactionClient?: Prisma.TransactionClient): Promise<void> {
    const client = transactionClient || prisma;
    await client.image.createMany({ data: images });
  }
}
