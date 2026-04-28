import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import { initializeWebSocket } from './services/websocket.service.js';
import { initializeAI } from './services/ai.service.js';
// import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize WebSocket
initializeWebSocket(server);

// Initialize AI
initializeAI();

// connectDB().then(() => {
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// });
