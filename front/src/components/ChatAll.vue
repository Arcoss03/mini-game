<script setup lang="ts">
  import { reactive } from 'vue';
  import socketClient from '../helpers/chatHelper';  // Importer le module créé


  const state = reactive({
    messages: [] as { pseudo: string; content: string; class:string } [], 
    newMessage: ''
  });


  socketClient.joinRoom(localStorage.getItem('token') as string, 1);


const sendMessage = () => {
    if (state.newMessage.trim() !== '') {
       const content=state.newMessage
       socketClient.message(localStorage.getItem('token') as string,content,1);
      }
      state.newMessage = ''; 
    }

socketClient.messageResponse(state.messages)
    
  
</script>
  

<template>
    
<main>
    <div>
    <h1>Chat Application</h1>
    <ul>
      <li v-for="(message, index) in state.messages" :key="index">
          <p><strong :class="message.class">{{ message.pseudo }}</strong>{{ message.content }}</p>
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

  main{
    .red{
      color:red;
    }
    .blue{
      color:blue;
    }
}

</style>
