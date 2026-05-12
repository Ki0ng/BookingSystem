import { Prisma, Room } from '@prisma/client';

export type RoomWithDetails = Prisma.RoomGetPayload<{
  include: { hotel: true, images: true }
}>;

export type RoomCreateInput = Prisma.RoomCreateInput;
export type RoomUpdateInput = Prisma.RoomUpdateInput;
export type RoomBase = Room;
