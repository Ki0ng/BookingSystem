import { getIO } from '../config/socket.config';

export class SocketService {
  emitToRoom(room: string, event: string, payload: any) {
    try {
      const io = getIO();
      io.to(room).emit(event, payload);
    } catch (error) {
      // Ignore if socket not initialized
    }
  }

  emitToUser(userId: string, event: string, payload: any) {
    this.emitToRoom(`user_${userId}`, event, payload);
  }

  emitToManager(managerId: string, event: string, payload: any) {
    this.emitToRoom(`manager_${managerId}`, event, payload);
  }

  emitToHotelRoom(hotelId: string, event: string, payload: any) {
    this.emitToRoom(`hotel_${hotelId}`, event, payload);
  }

  emitToAdmin(event: string, payload: any) {
    this.emitToRoom('admin_room', event, payload);
  }
}

export const socketService = new SocketService();
