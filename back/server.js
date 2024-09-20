const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Enable CORS for all origins
app.use(cors({ origin: '*' }));

const PORT = process.env.PORT || 8081;

// Create an HTTP server that works with Express
const server = http.createServer(app);

// Create a WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  ws.on('message', (message) => {
    // console.log('Received message:', message);
    // Broadcast the message
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
