const WebSocket = require('ws');

const port = process.env.PORT || 8081;  // Uses the environment variable PORT or defaults to 8081
const wss = new WebSocket.Server({ port });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);  // Send the message to all clients
      }
    });
  });
});

console.log(`WebSocket server is running on port ${port}`);
