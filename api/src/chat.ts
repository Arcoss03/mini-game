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

  const colors = [
    "#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#00FFFF",
    "#0000FF", "#8A2BE2", "#FF1493", "#FF4500", "#FF6347",
    "#FF69B4", "#FFD700", "#7FFF00", "#00FF7F", "#20B2AA",
    "#9400D3", "#FF00FF", "#00BFFF", "#FF00FF", "#FF5733",
    "#33FF57", "#3357FF", "#FF33A6", "#33FFF5", "#F533FF",
    "#57FF33", "#5733FF", "#FF3357", "#33FFB2", "#FFA633"
  ];
  
  

  function generateColor(pseudo:string){
    let asciiSum = 0;
    for (let i = 0; i < pseudo.length; i++) {
        asciiSum += pseudo.charCodeAt(i);
    }
      return colors[asciiSum%colors.length]
  }


  io.on('connection', (socket) => {
    socket.on('joinRoom', async (room) => {
      try {
        if(room==1){
          const token = room.user;
          const decoded = await fastify.jwt.verify(token);
          const { id } = decoded as { id: string };
          const [rows]: any = await fastify.db.query(
            'SELECT pseudo FROM users JOIN chat_participant ON chat_participant.user_id = users.id WHERE users.id = ? AND chat_participant.chat_room_id = ?',
            [id, room.id]
          );
  
          if (rows.length === 1) {
            socket.join(room.id);}
        }else{
          socket.join(room.id);}
          const [messages]: any = await fastify.db.query(
            'SELECT users.pseudo, message.content FROM message JOIN users ON message.sender_id = users.id WHERE message.chat_room_id = ? ORDER BY message.id DESC',
            [room.id]
          );

          if (messages.length >= 1) {
            messages.reverse();
            messages.forEach((message: any) => {
              socket.emit('messageResponse', { pseudo: message.pseudo, content: message.content, color: generateColor(message.pseudo) });
            });
          }
        
      } catch (err) {
        socket.emit('error', { error: 'Invalid token' });
      }
    });

    socket.on('message', async (msg) => {
      try {

        const token = msg.pseudo;
        const decoded = await fastify.jwt.verify(token);
        const { id } = decoded as { id: string };
      

        const [userRows]: any = await fastify.db.query('SELECT pseudo FROM users WHERE id = ?', [id]);
        const pseudo = userRows[0].pseudo;
      
       
        const [participantRows]: any = await fastify.db.query(
          'SELECT pseudo FROM users JOIN chat_participant ON chat_participant.user_id = users.id WHERE users.id = ? AND chat_participant.chat_room_id = ?',
          [id, msg.roomId]
        );
        if (participantRows.length === 1) {
          const color = generateColor(pseudo);
          socket.to(msg.roomId).emit('messageResponse', { pseudo, content: msg.content, color });
          socket.emit('messageResponse', { pseudo, content: msg.content, color });
          await fastify.db.query('INSERT INTO message (content, sender_id, chat_room_id) VALUES (?, ?, ?)', [msg.content, id, msg.roomId]);
        } else {
          socket.emit('error', { error: 'Player not in this room' });
        }
      } catch (err) {
        socket.emit('error', { error: 'Invalid token' });
      }
    });



    socket.on("leaveRoom", () => {
      const rooms = Array.from(socket.rooms);
      rooms.forEach(room => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
    });
  });

  fastify.decorate('io', io);
};

export default setupSocket;
