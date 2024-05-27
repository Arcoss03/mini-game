import { Server as SocketIOServer  } from 'socket.io';
import { FastifyInstance } from 'fastify';


const setupSocket = (fastify: FastifyInstance) => {
  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg: string) => {
      console.log('Message received: ' + msg);
      io.emit('message', msg); 
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  fastify.decorate('io', io);
};

export default setupSocket;
