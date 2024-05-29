import { io} from 'socket.io-client';


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

  const message=(token:string,content:string,roomId:number)=>{
    socket.emit('message', {pseudo:token,content:content,roomId:roomId});
  }

  const messageResponse = (data:{ pseudo: string; content: string; class: string }[]) => {
        socket.on('messageResponse', (message: { pseudo: string, content: string, class: string })=>{
          data.push(message)
        }
        );
};  

  export default { joinRoom, message, messageResponse,}
  

  

  