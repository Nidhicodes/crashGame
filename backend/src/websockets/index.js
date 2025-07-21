const WebSocket = require('ws');

let wss;

const setupWebSockets = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
      // Simple broadcast for now. This will be expanded to handle game logic.
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
};

const getIO = () => {
  if (!wss) {
    throw new Error('WebSocket server not initialized.');
  }
  return wss;
};

// Function to broadcast to all clients
const broadcast = (data) => {
    getIO().clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

module.exports = {
    setupWebSockets,
    getIO,
    broadcast,
};
