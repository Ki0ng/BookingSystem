import { Prisma, Hotel } from '@prisma/client';

export type HotelWithDetails = Prisma.HotelGetPayload<{
  include: { rooms: true; images: true; amenities: true };
}>;

export interface HotelSearchQuery {
  name?: string;
  location?: string;
}

export type HotelCreateInput = Prisma.HotelCreateInput;
export type HotelUpdateInput = Prisma.HotelUpdateInput;
export type HotelBase = Hotel;
