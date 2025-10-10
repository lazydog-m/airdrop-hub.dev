import { io } from 'socket.io-client';

export const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL;
export const socket = io(SOCKET_BASE_URL);

