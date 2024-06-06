<script setup lang="ts">
import { io } from 'socket.io-client';
import { reactive, onMounted } from 'vue';
import apiHelper from '@/helpers/apiHelper';
import router from '@/router';

const state = reactive({
  messages: [] as [],
  name: '',
  date:Date,

});

const apiUrl = import.meta.env.VITE_API_URL as string;
const apiKey = import.meta.env.VITE_API_KEY as string;

const props = defineProps<{ lobbyId: string }>();

onMounted(async () => {
  const res = await apiHelper.kyGetWithToken(`garticPhone/${props.lobbyId}`, localStorage.getItem('token') as string);
  if (!res.success) {
    router.push('/joinGF');
  } else {
    let room:any=res.data.room
    state.name = room.name;
    state.date = room.creation_date;
    const socket = io(apiUrl, {
      auth: {
        apiKey: apiKey
      }
    });

    socket.emit('joinGF', { pseudo: localStorage.getItem('token'), roomId: props.lobbyId });

    socket.on("joinedRoom", (data) => {
      state.messages = data.pseudos;
    });
  }
});
</script>

<template>
  <main>
    <h1>Lobby {{ props.lobbyId }}</h1>
    <h2>{{ state.name }}</h2>
    <ul>
      <li v-for="(message, index) in state.messages" :key="index">
        <p>
          <img style="width: 15px;" :src="message[1]" alt="" />
          <strong>{{ message[0] }}</strong>
        </p>
      </li>
    </ul>
    <button>Play</button>
    <p>{{ state.date }}</p>
  </main>
</template>

<style scoped lang="scss">
/* Add your scoped styles here if needed */
</style>
