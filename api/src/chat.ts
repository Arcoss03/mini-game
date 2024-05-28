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

    socket.on('joinRoom', async function(room) {
        const token = room.user;
        const decoded = await fastify.jwt.verify(token);
        const { id } = decoded as { id: string }; 
        const [rows]: any = await fastify.db.query('SELECT pseudo FROM users JOIN chat_participant ON chat_participant.user_id = users.id WHERE users.id = ? AND chat_participant.chat_room_id = ?', [id,room.id]);
        if(rows.length===1){
          socket.join(room.id);
        }
  });


    socket.on('message', async (msg) => {
      try {
        const token = msg.pseudo;
        const decoded = await fastify.jwt.verify(token);
        const { id } = decoded as { id: string }; 
        const [rows]: any = await fastify.db.query('SELECT pseudo FROM users WHERE id = ?', [id]);

        if (rows.length >= 1) {
          const [rows]: any = await fastify.db.query('SELECT pseudo FROM users JOIN chat_participant ON chat_participant.user_id = users.id WHERE users.id = ? AND chat_participant.chat_room_id = ?', [id,msg.roomId]);
          if(rows.length===1){
            socket.to(msg.roomId).emit('messageResponse', { pseudo: rows[0].pseudo, content: msg.content,class:"red" });
            socket.emit('messageResponse', { pseudo: rows[0].pseudo, content: msg.content,class:"blue" });
        }
          
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
