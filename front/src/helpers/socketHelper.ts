import { io} from 'socket.io-client';
import router from '@/router';


    const apiUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    
  
    const socket = io(apiUrl, {
         auth: {
            apiKey: apiKey
        }
    }); 

  

  const joinRoom=(token:string,roomId:number)=>{
    socket.emit('joinRoom',{user:token,id:roomId})
  }

  const quitRoom=()=>{
    socket.emit('leaveRoom')
  }

  const message=(token:string,content:string,roomId:number)=>{
    socket.emit('message', {pseudo:token,content:content,roomId:roomId});
  }

  const messageResponse = (data:{ pseudo: string; content: string; color: string }[]) => {
        socket.on('messageResponse', (message: { pseudo: string, content: string, color: string })=>{
          data.push(message)
        }
        );
};  


const joinLobby=(token:string,roomId:string)=>{
  socket.emit('joinGF', { pseudo: token, roomId: roomId});
}
const handleJoinedRoom = (state: any) => {
socket.on("joinedRoom", (data) => {
  state.messages = data.pseudos;
})
};

const handleChef = (state: any) => {
socket.on("chef", (data) => {
  state.isChef = data.isChef;
})
};


const invalidToken = () => {
  socket.on('error', (errorMessage) => {
    if (errorMessage.error === 'Invalid token') { 
      console.error('Ne peux pas ecrire')
      router.push("/login");
    }
  });
};

  export default { joinRoom, message, messageResponse,quitRoom,invalidToken,joinLobby,handleJoinedRoom,handleChef}
  

  

  