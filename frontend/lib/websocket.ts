import WebSocket from 'isomorphic-ws';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';

let socket: WebSocket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      socket = null;
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      socket = null;
    };
  }
  return socket;
};
