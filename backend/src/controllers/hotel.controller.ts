import { Request, Response } from 'express';
import { hotelService } from '../services/hotel.service';
import { asyncHandler } from '../utils/asyncHandler';

export const hotelController = {
  listHotels: asyncHandler(async (req: Request, res: Response) => {
    const { location, minPrice, maxPrice, rating, checkIn, checkOut, guests, flexibility } = req.query;
    
    const hotels = await hotelService.getAllHotels({
      location: location as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      rating: rating ? parseFloat(rating as string) : undefined,
      checkIn: checkIn as string,
      checkOut: checkOut as string,
      guests: guests ? parseInt(guests as string) : undefined,
      flexibility: flexibility ? parseInt(flexibility as string) : undefined,
    });

    res.json({
      success: true,
      data: hotels
    });
  }),

  getHotel: asyncHandler(async (req: Request, res: Response) => {
    const { id: hotelId } = req.params;
    const hotel = await hotelService.getHotelById(hotelId);

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    res.json({
      success: true,
      data: hotel
    });
  }),

  getMyHotels: asyncHandler(async (req: Request, res: Response) => {
    const ownerId = (req.user as any).userId;
    const hotels = await hotelService.getHotelsByOwner(ownerId);
    res.json({ success: true, data: hotels });
  }),

  createHotel: asyncHandler(async (req: Request, res: Response) => {
    const ownerId = (req.user as any).userId;
    const hotel = await hotelService.createHotel(ownerId, req.body);
    res.status(201).json({ success: true, data: hotel });
  }),

  updateHotel: asyncHandler(async (req: Request, res: Response) => {
    const { id: hotelId } = req.params;
    const userId = (req.user as any).userId;
    const role = (req.user as any).role;

    const existingHotel = await hotelService.getHotelById(hotelId);
    if (!existingHotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    // Only owner or admin can update
    if (existingHotel.ownerId !== userId && role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this hotel' });
    }

    const updatedHotel = await hotelService.updateHotel(hotelId, req.body);
    res.json({ success: true, data: updatedHotel });
  }),

  deleteHotel: asyncHandler(async (req: Request, res: Response) => {
    const { id: hotelId } = req.params;
    const userId = (req.user as any).userId;
    const role = (req.user as any).role;

    const existingHotel = await hotelService.getHotelById(hotelId);
    if (!existingHotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    if (existingHotel.ownerId !== userId && role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this hotel' });
    }

    await hotelService.deleteHotel(hotelId);
    res.json({ success: true, message: 'Hotel deleted successfully' });
  })
};
