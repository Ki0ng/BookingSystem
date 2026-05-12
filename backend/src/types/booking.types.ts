import { Prisma, Booking } from '@prisma/client';

export interface CreateBookingDTO {
  roomId: string;
  hotelId?: string;
  checkIn: string;
  checkOut: string;
  totalPrice?: number;
  guests?: number;
}

export type BookingWithDetails = Prisma.BookingGetPayload<{
  include: { room: { include: { hotel: true } }, user: true }
}>;

export type BookingBase = Booking;
export { BookingStatus } from '@prisma/client';
