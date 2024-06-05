<script setup lang="ts">
import { io } from 'socket.io-client';
import { reactive, onMounted } from 'vue';
import apiHelper from '@/helpers/apiHelper';
import router from '@/router';

const state = reactive({
  messages: [] as string[],
});
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

const props = defineProps<{ lobbyId: string }>();

onMounted(async () => {
  const res = await apiHelper.kyGetWithToken(`garticPhone/${props.lobbyId}`, localStorage.getItem('token') as string);
  if (!res.success) {
    router.push('/joinGF')
  } else {
    const socket = io(apiUrl, {
      auth: {
        apiKey: apiKey
      }
    });

    socket.emit('joinGF', { pseudo: localStorage.getItem('token'), roomId: props.lobbyId });

    socket.on("joinedRoom", (data) => {
      const pseudos = data.pseudos;
      state.messages = pseudos;
    });
  }
});
</script>

<template>
  <main>
    <h1>Lobby {{ lobbyId }}</h1>
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
