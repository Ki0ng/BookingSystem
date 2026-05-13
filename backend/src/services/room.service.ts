import { Prisma } from '@prisma/client';
import { RoomRepository } from '../repositories/room.repository';

export interface CreateRoomDTO {
  hotelId: string;
  room_type: string;
  base_price: number;
  quantity: number;
  capacity: number;
  status?: any;
  metadata?: any;
  images?: string[];
}

export class RoomService {
  private readonly roomRepository = new RoomRepository();

  createRoom = async (inputData: CreateRoomDTO) => {
    const { images, ...roomData } = inputData;
    
    const formattedData: Prisma.RoomUncheckedCreateInput = {
      ...roomData,
      metadata: roomData.metadata || {},
      images: images ? {
        create: images.map(url => ({ url }))
      } : undefined
    };

    return await this.roomRepository.create(formattedData);
  };

  getRoomsByHotel = async (hotelId: string) => {
    return await this.roomRepository.findManyByHotelId(hotelId);
  };

  updateRoom = async (roomId: string, inputUpdates: Partial<CreateRoomDTO>) => {
    const { images, ...roomUpdates } = inputUpdates;

    return await this.roomRepository.update(roomId, {
      ...roomUpdates,
      metadata: roomUpdates.metadata || undefined,
      images: images ? {
        deleteMany: {},
        create: images.map(url => ({ url }))
      } : undefined
    });
  };

  deleteRoom = async (roomId: string) => {
    return await this.roomRepository.delete(roomId);
  };
}
