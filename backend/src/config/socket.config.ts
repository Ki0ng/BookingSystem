import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from './env.config';
import logger from '../utils/logger';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true
    }
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`🔌 Socket connected: ${socket.id}`);

    socket.on('join_hotel', (hotelId: string) => {
      socket.join(`hotel_${hotelId}`);
      logger.info(`🏨 Socket ${socket.id} joined hotel: ${hotelId}`);
    });

    socket.on('join_manager', (managerId: string) => {
      socket.join(`manager_${managerId}`);
      logger.info(`👨‍💼 Socket ${socket.id} joined manager room: ${managerId}`);
    });

    socket.on('join_user', (userId: string) => {
      socket.join(`user_${userId}`);
      logger.info(`👤 Socket ${socket.id} joined user room: ${userId}`);
    });

    socket.on('join_admin', () => {
      socket.join('admin_room');
      logger.info(`👑 Socket ${socket.id} joined admin room`);
    });

    socket.on('disconnect', () => {
      logger.info(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
