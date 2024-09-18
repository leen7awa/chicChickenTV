const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 8081;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server instance
const wss = new WebSocket.Server({ server });

// Shared array to store order statuses
let orders = [];

// WebSocket connection logic
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send current orders to newly connected clients
  ws.send(JSON.stringify(orders));

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    // Parse the incoming message as JSON
    const orderUpdate = JSON.parse(message);
    const { orderId, status } = orderUpdate;

    // Check if the order already exists in the array
    const existingOrder = orders.find(order => order.orderId === orderId);

    if (existingOrder) {
      // Update the order status if it exists
      existingOrder.status = status;
    } else {
      // Add new order if it doesn't exist
      orders.push(orderUpdate);
    }

    // Broadcast the updated order list to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(orders));
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
