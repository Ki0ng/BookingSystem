import { Request, Response } from 'express';
import { RoomService } from '../services/room.service';
import { asyncHandler } from '../utils/asyncHandler';

const roomService = new RoomService();

export class RoomController {
  createRoom = asyncHandler(async (req: Request, res: Response) => {
    const room = await roomService.createRoom(req.body);
    res.status(201).json({ success: true, data: room });
  });

  getHotelRooms = asyncHandler(async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const rooms = await roomService.getRoomsByHotel(hotelId);
    res.status(200).json({ success: true, data: rooms });
  });

  updateRoom = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const room = await roomService.updateRoom(id, req.body);
    res.status(200).json({ success: true, data: room });
  });

  deleteRoom = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await roomService.deleteRoom(id);
    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  });
}
