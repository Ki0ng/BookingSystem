import { Hotel, Room } from './hotel.types';
import { User } from './common.types';

export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  guests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  hotel?: Hotel;
  room?: Room;
  user?: User;
}
