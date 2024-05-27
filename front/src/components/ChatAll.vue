<script setup lang="ts">
  import { reactive } from 'vue';
  import { io, Socket } from 'socket.io-client';
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  
  const state = reactive({
    connected: false,
    messages: [], // Ajoute la propriété messages
    newMessage: ''
  });
  
  const socket = io(apiUrl, {
  auth: {
    apiKey: apiKey
  }
}); 
  
  socket.on('connection', () => {
    state.connected = true;
  });
  
  socket.on('disconnect', () => {
    state.connected = false;
  });
  
  socket.emit('message', ('test'))


  
  </script>
  

<template>
    
<main>
    <div>
    <h1>Chat Application</h1>
  </div>
</main>
</template>

<style scoped lang="scss">


</style>
