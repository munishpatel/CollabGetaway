// server.js
const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;
require('dotenv').config();
const { OpenAI } = require('openai');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 1234;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Setup WS connection for Yjs
wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// AI Assistant endpoint
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { messages, itinerary, markers } = req.body;

    // Create context from current trip data
    const tripContext = `
      Current Trip Details:
      - Itinerary: ${itinerary.map(day => day.title).join(', ')}
      - Locations: ${markers.map(marker => marker.title).join(', ')}
      - Last User Message: ${messages[messages.length - 1]?.content || ''}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if available
      messages: [
        {
          role: "system",
          content: `You are a helpful travel assistant for the CollabGetaway app. Help users plan their collaborative trip. 
          Current trip details: ${tripContext}
          Be concise, friendly, and offer practical suggestions. When suggesting activities, consider:
          1. Group preferences
          2. Current itinerary
          3. Popular local experiences
          4. Budget-friendly options
          5. Unique local gems`
        },
        ...messages
      ],
      temperature: 0.7,
    });

    res.json({
      success: true,
      message: response.choices[0].message.content
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get AI response"
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

server.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`✅ Yjs WebSocket server running on ws://localhost:${port}`);
});