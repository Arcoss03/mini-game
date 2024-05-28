import { Server as SocketIOServer } from 'socket.io';
import { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

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
    socket.on('message', async (msg) => {
      try {
        const token = msg.pseudo;
        const decoded = await fastify.jwt.verify(token);
        const { id } = decoded as { id: string }; 
        const [rows]: any = await fastify.db.query('SELECT pseudo FROM users WHERE id = ?', [id]);

        if (rows.length >= 1) {
          io.emit('messageResponse', { pseudo: rows[0].pseudo, content: msg.content });
      }

      } catch (err) {
        console.error('Invalid token', err);
        socket.emit('error', { error: 'Invalid token' });
      }
    });
  });

  fastify.decorate('io', io);
};

export default setupSocket;
