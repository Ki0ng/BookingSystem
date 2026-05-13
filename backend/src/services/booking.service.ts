import prisma from '../config/db.config';
import { Prisma, Booking } from '@prisma/client';
import { CreateBookingDTO, BookingWithDetails } from '../types/booking.types';
import { socketService } from './socket.service';
import { BookingRepository } from '../repositories/booking.repository';
import { RoomRepository } from '../repositories/room.repository';
import { BookingUtils } from '../utils/booking.utils';
import { PAGINATION } from '../config/constants';

export class BookingService {
  private readonly bookingRepository = new BookingRepository();
  private readonly roomRepository = new RoomRepository();

  createBooking = async (userId: string, bookingData: CreateBookingDTO): Promise<Booking> => {
    const { roomId, checkIn, checkOut } = bookingData;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const room = await this.roomRepository.findById(roomId);
    if (!room) throw new Error("Room not found");
    this.validateBookingRequest(room.status, room.hotel.ownerId, userId);

    const booking = await prisma.$transaction(async (transactionClient) => {
      await this.ensureRoomAvailability(roomId, checkInDate, checkOutDate, room.quantity, transactionClient);
      const totalPrice = BookingUtils.calculateTotalPrice(room.base_price, checkInDate, checkOutDate);
      
      return await this.bookingRepository.create({
        userId, roomId, checkIn: checkInDate, checkOut: checkOutDate, totalPrice, status: 'CONFIRMED'
      }, transactionClient);
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    socketService.emitToManager((booking.room as any).hotel.ownerId, 'new_booking', booking);
    return booking;
  };

  private validateBookingRequest = (roomStatus: string, ownerId: string, userId: string) => {
    if (roomStatus !== 'AVAILABLE') throw new Error("Room is not available");
    if (ownerId === userId) throw new Error("Owner cannot book their own property");
  };

  private ensureRoomAvailability = async (roomId: string, checkIn: Date, checkOut: Date, totalQuantity: number, transactionClient: Prisma.TransactionClient) => {
    const overlappingBookingsCount = await transactionClient.booking.count({
      where: { roomId, status: { in: ['CONFIRMED', 'PENDING'] }, checkIn: { lt: checkOut }, checkOut: { gt: checkIn } }
    });
    if (totalQuantity - overlappingBookingsCount <= 0) throw new Error("No rooms available");
  };

  getUserBookings = async (userId: string) => this.bookingRepository.findManyByUserId(userId);

  getManagerBookings = async (managerId: string, paginationOptions: any = {}) => {
    const page = parseInt(paginationOptions.page) || PAGINATION.DEFAULT_PAGE;
    const limit = paginationOptions.limit === 'all' ? PAGINATION.MAX_LIMIT : (parseInt(paginationOptions.limit) || PAGINATION.DEFAULT_LIMIT);
    const skip = paginationOptions.limit === 'all' ? 0 : (page - 1) * limit;
    const [bookings, totalBookings] = await this.bookingRepository.findManagerBookings(managerId, skip, limit);

    return { data: bookings, pagination: { total: totalBookings, page, limit, pages: Math.ceil(totalBookings / limit) } };
  };

  getBookingDetails = async (bookingId: string) => this.bookingRepository.findById(bookingId);

  cancelBooking = async (bookingId: string) => {
    const booking = await this.bookingRepository.updateStatus(bookingId, 'CANCELLED');
    socketService.emitToManager((booking.room as any).hotel.ownerId, 'booking_updated', booking);
    return booking;
  };
}
