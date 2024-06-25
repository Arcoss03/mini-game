import { FastifyInstance } from 'fastify';
import { io } from './chat';
import dotenv from 'dotenv';

dotenv.config();

const setupSocketGF = (fastify: FastifyInstance) => {
  
  
  const pseudosInRoom: { [roomId: string]: any[] } = {};

  const roomGp: { [roomId: string]: any[] } = {};
  const socketTokenRoom: { [roomId: string]: any[] } = {};
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
      const[owner]:any=await fastify.db.query(
        'SELECT creator_id FROM room_GP WHERE id = ?',
        [roomId]
      );
      
      let chef
      if(owner[0].creator_id==id){
        chef=true
        socket.emit("chef",{isChef:true});
      }
      else if((!pseudosInRoom[room.roomId])||pseudosInRoom[room.roomId].length==0){
        await fastify.db.query(
          'UPDATE room_GP SET creator_id=? where id=?',
          [id,roomId]
        );
        chef=true
        socket.emit("chef",{isChef:true});
      }

      if (participantRows.length > 0) {
        socket.join(room.roomId);

        if (!pseudosInRoom[room.roomId]) {
          pseudosInRoom[room.roomId] = [];
        }

        if (!pseudosInRoom[room.roomId].includes(userPseudo)) {
          pseudosInRoom[room.roomId].push([userPseudo, userRows[0].profil_picture,chef]);
        }
        io.to(room.roomId).emit('joinedRoom', { pseudos: pseudosInRoom[room.roomId]});
      } else {
        socket.emit('error', { error: 'User not in the room' });
      }
    } catch (err) {
      socket.emit('error', { error: 'Invalid token' });
    }
  });



  socket.on("createPrompt",async (room)=>{
    roomGp[room.roomId] = [];
    console.log(socketTokenRoom[room.roomId])
    try{
    const token = room.token;
      const decoded = await fastify.jwt.verify(token);
      const { id } = decoded as { id: string };
      const [insertPrompt]: any = await fastify.db.query(
        'INSERT INTO guess_prompt (img_url, prompt, turn, user_id, game_GP_id, id_GP_before) VALUES (?, ?, ?, ?, ?, ?);'
        , [room.data,room.prompt,room.turn,id,room.roomId-11111,room.last]);
        const insertId = insertPrompt.insertId;
        if (!roomGp[room.roomId]) {
          roomGp[room.roomId] = [];
        }

        if (!roomGp[room.roomId].includes(insertId)) {
          roomGp[room.roomId].push(insertId);
        }
        if (!socketTokenRoom[room.roomId]) {
          socketTokenRoom[room.roomId] = [];
        }

        if (!socketTokenRoom[room.roomId].some(pair => pair[0] === socket.id && pair[1] === id)) {
          socketTokenRoom[room.roomId].push([socket.id, id]);
        }
        const delay=room.timer*1000+3000;

        setTimeout(async() => {
          let index = socketTokenRoom[room.roomId].findIndex(pair => pair[0] === socket.id && pair[1] === id);
          if(socketTokenRoom[room.roomId][index+room.turn+1]==undefined){
            index=0;
          }else{
            index+=room.turn+1;
          }
          /*if(socketTokenRoom[room.roomId].length==turn+1){
            socket.emit("resume");
          }else{*/
          const [nextPrompt]: any = await fastify.db.query(
            'SELECT * FROM guess_prompt WHERE id=?'
            , [roomGp[room.roomId][index]]);
            socket.emit("nextPrompt",{img:nextPrompt[0].img_url,turn:nextPrompt[0].turn,id:nextPrompt[0].id})
         // }
    }, delay);}
    catch{
      console.log("error")
    }
        
      
  })


  socket.on('play',(room)=>{
    socket.emit('start');
    io.to(room).emit('start');
    

  })

  socket.on('disconnect', async() => {
    const disconnectedToken = socketTokens[socket.id];
    
    const roomId=parseInt(socketRoom[socket.id])-11111;
    try{

      const [userRows]: any = await fastify.db.query('SELECT pseudo FROM users WHERE id = ?', [disconnectedToken]);
      if (pseudosInRoom[socketRoom[socket.id]].some(tuple => tuple[0] ===userRows[0].pseudo)) {
        pseudosInRoom[socketRoom[socket.id]] = pseudosInRoom[socketRoom[socket.id]].filter(tuple => tuple[0] !== userRows[0].pseudo);
    }
    

    const delay = 500;

    setTimeout(async() => {
      const room=socketRoom[socket.id];
    if (pseudosInRoom[socketRoom[socket.id]].every(tuple => tuple[0] !== userRows[0].pseudo)){
      await fastify.db.query(
        'DELETE FROM guess_prompt_participant WHERE room_GP_id=? and user_id=?',
        [roomId, disconnectedToken]
      );

     const[chatRoom]:any= await fastify.db.query(
        'SELECT chat_room_id FROM room_GP WHERE id=?',
        [roomId]
      );
      await fastify.db.query(
        'DELETE FROM chat_participant WHERE chat_room_id=? and user_id=?',
        [chatRoom[0].chat_room_id, disconnectedToken]
      );

      if (socketTokens[socket.id] === disconnectedToken) {
        delete socketTokens[socket.id];        
    }

    let firstElement=pseudosInRoom[socketRoom[socket.id]][0];
    if(firstElement){
      firstElement[2]=true;
      
      io.to(socketRoom[socket.id]).emit('joinedRoom', { pseudos: pseudosInRoom[socketRoom[socket.id]]});
      delete socketRoom[socket.id]
      let [cleTrouvee]:any = Object.entries(socketRoom).find(([cle, valeur]) => valeur === room) || [];
      io.to(cleTrouvee.toString()).emit("chef",{isChef:true})
      if(socketTokens[cleTrouvee.toString()]){
      await fastify.db.query(
        'UPDATE room_GP SET creator_id=? where id=?',
        [socketTokens[cleTrouvee.toString()],roomId]
        
      );}
  
      
    }
       
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
