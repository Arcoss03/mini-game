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
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A6",
    "#33FFF5",
    "#F533FF",
    "#57FF33",
    "#5733FF",
    "#FF3357",
    "#33FFB2",
    "#FFA633",
    "#33A6FF",
    "#FF5733",
    "#33FFA6",
    "#A633FF"
];
  
function generateColor(pseudo:string){
  let asciiSum = 0;

  for (let i = 0; i < pseudo.length; i++) {
    if(i%2==0){
      asciiSum += pseudo.charCodeAt(i);
    }else{
      asciiSum -= pseudo.charCodeAt(i);
    }
    return (asciiSum>0)?colors[asciiSum%colors.length]:colors[(asciiSum%colors.length)*-1]
}
}


  io.on('connection', (socket) => {

    socket.on('joinRoom', async function(room) {
      try{
        const token = room.user;
        const decoded = await fastify.jwt.verify(token);
        const { id } = decoded as { id: string }; 
        const [rows]: any = await fastify.db.query('SELECT pseudo FROM users JOIN chat_participant ON chat_participant.user_id = users.id WHERE users.id = ? AND chat_participant.chat_room_id = ?', [id,room.id]);
        if(rows.length===1){
          socket.join(room.id);
          const [rows]: any = await fastify.db.query('SELECT users.pseudo, message.content FROM message JOIN users ON message.sender_id = users.id WHERE  message.chat_room_id = ? ORDER BY message.id DESC LIMIT 20', [room.id]);
          if(rows.length>=1){
            rows.reverse();
            rows.forEach((row :any) => {
              socket.emit('messageResponse', { pseudo: row.pseudo, content: row.content,color:generateColor(row.pseudo) });
            });
            
          }
        }
      }catch (err) {
        socket.emit('error', { error: 'Invalid token' });
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
            socket.to(msg.roomId).emit('messageResponse', { pseudo: rows[0].pseudo, content: msg.content,color:generateColor(rows.pseudo) });
            socket.emit('messageResponse', { pseudo: rows[0].pseudo, content: msg.content,color:generateColor(rows.pseudo) });
            await fastify.db.query(
              'INSERT INTO  message (content, sender_id, chat_room_id) VALUES (?, ?, ?)', 
              [msg.content, id, msg.roomId]
          );
        } 
      }
      socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
      });

      } catch (err) {
        socket.emit('error', { error: 'Invalid token' });
      }
    });
  });

  fastify.decorate('io', io);
};

export default setupSocket;
