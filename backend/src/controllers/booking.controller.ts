import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { asyncHandler } from '../utils/asyncHandler';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const booking = await this.bookingService.createBooking(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: booking });
  });

  getMyBookings = asyncHandler(async (req: Request, res: Response) => {
    const bookings = await this.bookingService.getUserBookings(req.user!.userId);
    res.status(200).json({ success: true, data: bookings });
  });

  getManagerBookings = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.bookingService.getManagerBookings(req.user!.userId, req.query);
    res.status(200).json({ success: true, ...result });
  });

  getBooking = asyncHandler(async (req: Request, res: Response) => {
    const booking = await this.bookingService.getBookingDetails(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    // Check if user is owner or admin
    if (booking.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    res.status(200).json({ success: true, data: booking });
  });

  cancel = asyncHandler(async (req: Request, res: Response) => {
    const booking = await this.bookingService.getBookingDetails(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    // Security: Only owner or admin can cancel
    if (booking.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot cancel someone else\'s booking' });
    }

    await this.bookingService.cancelBooking(req.params.id);
    res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
  });
}
