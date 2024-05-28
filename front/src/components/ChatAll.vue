<script setup lang="ts">
  import { reactive } from 'vue';
  import { io, Socket} from 'socket.io-client';
  import { ref } from 'vue';


  const apiUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  
  const state = reactive({
    messages: [] as { pseudo: string; content: string } [], 
    newMessage: ''
  });
  
  
  const socket = io(apiUrl, {
  auth: {
    apiKey: apiKey
  }
}); 

  

  const sendMessage = () => {
    if (state.newMessage.trim() !== '') {
      const data={
        pseudo:localStorage.getItem('token'),
        content:state.newMessage
      }
      socket.emit('message', data);
      state.newMessage = ''; 
    }
  };

  socket.on('messageResponse',(message : {pseudo:string,content:string}) =>{
      state.messages.push(message)
  })
  
  </script>
  

<template>
    
<main>
    <div>
    <h1>Chat Application</h1>
    <ul>
      <li v-for="(message, index) in state.messages" :key="index">
          <p><strong>{{ message.pseudo }}</strong> {{ message.content }}</p>
      </li>
    </ul>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="state.newMessage" placeholder="Saisissez votre message..." />
      <button type="submit">Envoyer</button>
    </form>
  </div>
</main>
</template>

<style scoped lang="scss">


</style>
