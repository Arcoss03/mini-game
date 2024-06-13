<script setup lang="ts">
import { io } from 'socket.io-client';
import { reactive, onMounted } from 'vue';
import apiHelper from '@/helpers/apiHelper';
import router from '@/router';
import socketClient from '../helpers/socketHelper'

const state = reactive({
  messages: [] as Array<[string, string, string]>,
  name: '',
  date: new Date(),
  isChef: false,
});


const props = defineProps<{ lobbyId: string }>();

onMounted(async () => {
  const res = await apiHelper.kyGetWithToken(`garticPhone/${props.lobbyId}`, localStorage.getItem('token') as string);
  if (!res.success) {
    router.push('/choice-gmp');
  } else {
    let room: any = res.data.room;
    state.name = room.name;
    state.date = new Date(room.creation_date);
  
    socketClient.joinLobby(localStorage.getItem('token') as any,props.lobbyId);
    socketClient.handleJoinedRoom(state)
    socketClient.handleChef(state)
  }
});

const startGame = async () => {
  const res = await apiHelper.kyPost(`garticPhone/play`, { id: props.lobbyId }, localStorage.getItem('token') as string);
  if (!res.success) {
    router.push('/login');
  }
};
</script>

<template>
  <main>
    <h1>Lobby {{ props.lobbyId }}</h1>
    <h2>{{ state.name }}</h2>
    <ul>
      <li v-for="(message, index) in state.messages" :key="index">
        <p>
          <p>{{ message[2] }}</p>
          <img style="width: 15px;" :src="message[1]" alt="" />
          <strong>{{ message[0] }}</strong>
        </p>
      </li>
    </ul>
    <button v-if="state.isChef" @click="startGame">Play</button>
    <p>{{ state.date }}</p>
  </main>
</template>

<style scoped lang="scss">
/* Add your scoped styles here if needed */
</style>
