// const WebSocket = require('ws');

// // const wss = new WebSocket.Server({ port: 8081 });

// const port = process.env.PORT || 8081;
// const wss = new WebSocket.Server({ port });

// wss.on('connection', (ws) => {
//   ws.on('message', (message) => {
//     // Broadcast the message to all connected clients
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);  // Send message as a JSON string
//       }
//     });
//   });
// });

// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');

// // Initialize express app
// const app = express();
// const port = process.env.PORT || 8081;

// // Create an HTTP server
// const server = http.createServer(app);

// // Initialize WebSocket server instance
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//   console.log('New client connected');
  
//   ws.on('message', (message) => {
//     console.log(`Received: ${message}`);
    
//     // Broadcast the message to all connected clients
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);  // Send message as a JSON string
//       }
//     });
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// // Start the HTTP server and WebSocket server
// server.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 8081;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server instance
const wss = new WebSocket.Server({ server });

// WebSocket connection logic
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Broadcast message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
