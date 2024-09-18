const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8081 });

const port = process.env.PORT || 8081;
const wss = new WebSocket.Server({ port });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);  // Send message as a JSON string
      }
    });
  });
});
