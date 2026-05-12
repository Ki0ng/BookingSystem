'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from './AuthProvider';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only connect if user is logged in
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // 🚀 Determine Socket URL based on environment
    const getSocketUrl = () => {
      const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (publicApiUrl) return publicApiUrl.replace(/\/api$/, '');
      
      if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:5000';
      }
      return ''; 
    };

    const socketUrl = getSocketUrl();
    if (!socketUrl) return;

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      if (process.env.NODE_ENV === 'development') {
        console.log('🔌 Socket connected:', socketInstance.id);
      }

      // Join relevant rooms
      if (user.role === 'ADMIN') {
        socketInstance.emit('join_admin');
      }
      if (user.role === 'MANAGER' || user.role === 'ADMIN') {
        socketInstance.emit('join_manager', user.id);
      }
      socketInstance.emit('join_user', user.id);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Socket disconnected');
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
