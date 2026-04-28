import { Server } from 'socket.io';

let io;

export const initializeWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For development
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('subscribeToJob', (data) => {
      const { jobId } = data;
      socket.join(jobId);
      console.log(`Socket ${socket.id} joined room ${jobId}`);
      // Acknowledge subscription
      socket.emit('subscriptionSuccess', { jobId });
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
