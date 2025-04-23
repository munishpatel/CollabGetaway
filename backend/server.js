// server.js
const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

const app = express();
const port = process.env.PORT || 1234;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Setup WS connection for Yjs
wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

server.listen(port, () => {
  console.log(`✅ Yjs WebSocket server running on ws://localhost:${port}`);
});
