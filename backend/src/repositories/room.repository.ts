import prisma from '../config/db.config';
import { Room } from '@prisma/client';

export class RoomRepository {
  async findById(id: string): Promise<any | null> {
    return prisma.room.findUnique({
      where: { id },
      include: { hotel: true }
    });
  }
}
