<script setup lang="ts">
import { io } from 'socket.io-client';
import { reactive } from 'vue';

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

const socket = io(apiUrl, {
  auth: {
    apiKey: apiKey
  }
});

const state = reactive({
  messages: [] as string[],
});


socket.emit('joinGF', { pseudo: localStorage.getItem('token'), roomId: 11112 });

socket.on("joinedRoom", (data) => {
  const pseudos = data.pseudos;
  state.messages = pseudos;
  console.log(state.messages)
});


</script>

<template>
    <main>
      <ul>
        <li v-for="(pseudo, index) in state.messages" :key="index">
          <p>
            <strong>{{ pseudo }}</strong>
          </p>
        </li>
      </ul>
    </main>
</template>

<style scoped lang="scss">
/* Add your scoped styles here if needed */
</style>
