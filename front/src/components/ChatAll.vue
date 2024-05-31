<script setup lang="ts">
  import { reactive } from 'vue';
  import socketClient from '../helpers/chatHelper';  
 // const props=defineProps({
 //
  //} 
  //)

  let room=1;
  const state = reactive({
    messages: [] as { pseudo: string; content: string; color:string } [], 
    newMessage: ''
  });
  state.messages.splice(0, state.messages.length);
  socketClient.quitRoom()
  socketClient.joinRoom(localStorage.getItem('token') as string, room);


const sendMessage = () => {
    if (state.newMessage.trim() !== '') {
       const content=state.newMessage
       socketClient.message(localStorage.getItem('token') as string,content,room);
      }
      state.newMessage = ''; 
    }

socketClient.messageResponse(state.messages)
socketClient.invalidToken()
  
</script>
  

<template>
    
<main>
    <div>
    <h1>Chat Application</h1>
    <ul>
      <li v-for="(message, index) in state.messages" :key="index">
          <p><strong :style="{ color: message.color }">{{ message.pseudo }}</strong>{{ message.content }}</p>
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
