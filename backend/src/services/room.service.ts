import prisma from '../config/db.config';
import { RoomStatus } from '@prisma/client';

export interface CreateRoomDTO {
  hotelId: string;
  room_type: string;
  base_price: number;
  quantity: number;
  capacity: number;
  status?: RoomStatus;
  metadata?: any;
  images?: string[];
}

export class RoomService {
  createRoom = async (data: CreateRoomDTO) => {
    const { images, ...roomData } = data;
    
    return await prisma.room.create({
      data: {
        ...roomData,
        metadata: roomData.metadata || {},
        images: {
          create: images?.map(url => ({ url })) || []
        }
      },
      include: {
        images: true
      }
    });
  };

  getRoomsByHotel = async (hotelId: string) => {
    return await prisma.room.findMany({
      where: { hotelId },
      include: {
        images: true
      }
    });
  };

  updateRoom = async (roomId: string, data: Partial<CreateRoomDTO>) => {
    const { images, ...roomData } = data;

    // Use transaction to update room and sync images
    return await prisma.$transaction(async (tx) => {
      if (images) {
        // Simple strategy: delete old images and add new ones
        await tx.image.deleteMany({ where: { roomId } });
        await tx.image.createMany({
          data: images.map(url => ({ url, roomId }))
        });
      }

      return await tx.room.update({
        where: { id: roomId },
        data: {
          ...roomData,
          metadata: roomData.metadata || undefined
        },
        include: {
          images: true
        }
      });
    });
  };

  deleteRoom = async (roomId: string) => {
    return await prisma.room.delete({
      where: { id: roomId }
    });
  };
}
