import { FastifyInstance } from 'fastify';
import { io } from './chat';
import dotenv from 'dotenv';

dotenv.config();

const setupSocketGF = (fastify: FastifyInstance) => {
  
  
  const pseudosInRoom: { [roomId: string]: any[] } = {};

 let socketTokens: { [socketId: string]:string } = {};
 let socketRoom: { [socketId: string]:string } = {};
io.on('connection', (socket) => {
  socket.on('joinGF', async (room) => {
    try {
      const token = room.pseudo;
      const decoded = await fastify.jwt.verify(token);
      const { id } = decoded as { id: string };
      socketTokens[socket.id] =id
      const [userRows]: any = await fastify.db.query('SELECT pseudo,profil_picture FROM users WHERE id = ?', [id]);

      if (userRows.length === 0) {
        socket.emit('error', { error: 'User not found' });
        return;
      }
  

      const userPseudo = userRows[0].pseudo;
      socketRoom[socket.id] =room.roomId
      const roomId=room.roomId-11111
      

      const [participantRows]:any = await fastify.db.query(
        'SELECT * FROM guess_prompt_participant WHERE user_id = ? AND room_GP_id = ?',
        [id, roomId]
      );

      if (participantRows.length > 0) {
        socket.join(room.roomId);

        if (!pseudosInRoom[room.roomId]) {
          pseudosInRoom[room.roomId] = [];
        }

        if (!pseudosInRoom[room.roomId].includes(userPseudo)) {
          pseudosInRoom[room.roomId].push([userPseudo, userRows[0].profil_picture]);
        }
        io.to(room.roomId).emit('joinedRoom', { pseudos: pseudosInRoom[room.roomId]});
      } else {
        socket.emit('error', { error: 'User not in the room' });
      }
    } catch (err) {
      socket.emit('error', { error: 'Invalid token' });
    }
  });

  socket.on('disconnect', async() => {
    const disconnectedToken = socketTokens[socket.id];
    const roomId=parseInt(socketRoom[socket.id])-11111;
    try{
      const [userRows]: any = await fastify.db.query('SELECT pseudo FROM users WHERE id = ?', [disconnectedToken]);
      if (pseudosInRoom[socketRoom[socket.id]].some(tuple => tuple[0] ===userRows[0].pseudo)) {
        pseudosInRoom[socketRoom[socket.id]] = pseudosInRoom[socketRoom[socket.id]].filter(tuple => tuple[0] !== userRows[0].pseudo);
    }

    const delay = 5000;

    setTimeout(async() => {
    if (pseudosInRoom[socketRoom[socket.id]].every(tuple => tuple[0] !== userRows[0].pseudo)){
      const [delParticipant]:any= await fastify.db.query(
        'DELETE FROM guess_prompt_participant WHERE room_GP_id=? and user_id=?',
        [roomId, disconnectedToken]
      );
      io.to(socketRoom[socket.id]).emit('joinedRoom', { pseudos: pseudosInRoom[socketRoom[socket.id]]}); 
  }
}, delay);
           
    }catch (err) {
      socket.to(socketRoom[socket.id]).emit('error', { error: 'Invalid token' });
    }

});
});


  fastify.decorate('GPio', io);
};

export default setupSocketGF;
