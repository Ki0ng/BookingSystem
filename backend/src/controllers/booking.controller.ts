import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { asyncHandler } from '../utils/asyncHandler';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const newBooking = await this.bookingService.createBooking(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: newBooking });
  });

  getMyBookings = asyncHandler(async (req: Request, res: Response) => {
    const userBookings = await this.bookingService.getUserBookings(req.user!.userId);
    res.status(200).json({ success: true, data: userBookings });
  });

  getManagerBookings = asyncHandler(async (req: Request, res: Response) => {
    const paginatedBookingsData = await this.bookingService.getManagerBookings(req.user!.userId, req.query);
    res.status(200).json({ success: true, ...paginatedBookingsData });
  });

  getBooking = asyncHandler(async (req: Request, res: Response) => {
    const { id: bookingId } = req.params;
    const bookingDetails = await this.bookingService.getBookingDetails(bookingId);
    
    if (!bookingDetails) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if user is owner or admin
    if (bookingDetails.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    res.status(200).json({ success: true, data: bookingDetails });
  });

  cancel = asyncHandler(async (req: Request, res: Response) => {
    const { id: bookingId } = req.params;
    const bookingDetails = await this.bookingService.getBookingDetails(bookingId);
    
    if (!bookingDetails) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Security: Only owner or admin can cancel
    if (bookingDetails.userId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot cancel someone else\'s booking' });
    }

    await this.bookingService.cancelBooking(bookingId);
    res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
  });
}
