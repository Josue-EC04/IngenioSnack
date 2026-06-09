import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });
  }
  return socket;
};

export const connectSocket = (userId, isAdmin = false) => {
  const sock = getSocket();
  if (!sock.connected) {
    sock.connect();
    sock.on('connect', () => {
      if (isAdmin) {
        sock.emit('join_admin_room');
      }
      if (userId) {
        sock.emit('join_user_room', userId);
      }
    });
  }
  return sock;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
