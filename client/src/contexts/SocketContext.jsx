import { SOCKET_SERVER_URL } from '@/socket';
import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const socket = io(SOCKET_SERVER_URL);
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
};

