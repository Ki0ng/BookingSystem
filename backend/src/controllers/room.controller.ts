import { Request, Response } from 'express';
import { RoomService } from '../services/room.service';
import { asyncHandler } from '../utils/asyncHandler';

const roomService = new RoomService();

export class RoomController {
  createRoom = asyncHandler(async (req: Request, res: Response) => {
    const newRoom = await roomService.createRoom(req.body);
    res.status(201).json({ success: true, data: newRoom });
  });

  getHotelRooms = asyncHandler(async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const hotelRooms = await roomService.getRoomsByHotel(hotelId);
    res.status(200).json({ success: true, data: hotelRooms });
  });

  updateRoom = asyncHandler(async (req: Request, res: Response) => {
    const { id: roomId } = req.params;
    const updatedRoom = await roomService.updateRoom(roomId, req.body);
    res.status(200).json({ success: true, data: updatedRoom });
  });

  deleteRoom = asyncHandler(async (req: Request, res: Response) => {
    const { id: roomId } = req.params;
    await roomService.deleteRoom(roomId);
    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  });
}
