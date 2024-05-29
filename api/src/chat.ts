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
        const pseudo=rows[0].pseudo;
        if(rows.length===1){
          socket.join(room.id);
          const [rows]: any = await fastify.db.query('SELECT users.pseudo, message.content FROM message JOIN users ON message.sender_id = users.id WHERE  message.chat_room_id = ? ORDER BY message.id DESC LIMIT 20', [room.id]);
          if(rows.length>=1){
            rows.reverse();
            console.log(rows)
            rows.forEach((row :any) => {
              if(row.pseudo===pseudo){
                socket.emit('messageResponse', { pseudo: row.pseudo, content: row.content,class:"blue" });
              }else{
                socket.emit('messageResponse', { pseudo: row.pseudo, content: row.content,class:"red" });
              }
            });
            
          }
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
            await fastify.db.query(
              'INSERT INTO  message (content, sender_id, chat_room_id) VALUES (?, ?, ?)', 
              [msg.content, id, msg.roomId]
          );
        }

        socket.on("leaveRoom", (roomId) => {
          socket.leave(roomId);
        });
          
      }

      } catch (err) {
        socket.emit('error', { error: 'Invalid token' });
      }
    });
  });

  fastify.decorate('io', io);
};

export default setupSocket;
