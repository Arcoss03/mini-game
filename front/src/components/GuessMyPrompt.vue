<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, reactive } from 'vue';
import ky from 'ky';
import socketHelper from '@/helpers/socketHelper';
import { io } from 'socket.io-client';
import router from '@/router';

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

const socket = io(apiUrl, {
  auth: {
    apiKey: apiKey
  }
});

const state = reactive({
  img: "" as string,
  turn:0,
});

const props = defineProps<{ gmpId: string }>();

const prompt = ref('');
const initialTime = 10;
const timeLeft = ref(initialTime);
let timer: any = null;
let last: any = null;

const startTimer = () => {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    const storedEndTime: any = localStorage.getItem('endTime');
    const currentTime = Math.floor(Date.now() / 1000);
    if (storedEndTime) {
      timeLeft.value = Math.max(0, storedEndTime - currentTime);
    }

    if (timeLeft.value <= 0) {
      submitPrompt();
    }
  }, 1000);
};

const submitPrompt = async () => {
  const data: any = await ky.get('https://api.thecatapi.com/v1/images/search?limit=1').json();

  if (prompt.value === '') {
    prompt.value = "Quand tu réalises que même un œuf a une meilleure chance de devenir quelque chose de plus extraordinaire que toi";
  }

  clearInterval(timer);
  socket.emit("createPrompt", { token: localStorage.getItem('token'), roomId: props.gmpId, prompt: prompt.value, data: data[0].url, timer: timeLeft.value, turn: state.turn, last: last });
  timeLeft.value = 0;
  localStorage.removeItem('endTime');
};

socket.on("nextPrompt", (data) => {
  state.turn = data.turn + 1;
  last = data.id;
  state.img = data.img;
  // Reset the timer when a new prompt is received
  timeLeft.value = initialTime;
  const endTime: any = Math.floor(Date.now() / 1000) + initialTime;
  localStorage.setItem('endTime', endTime);
  startTimer(); // Restart the timer
});


socket.on("resume",()=>{
  let gmpId=props.gmpId
  router.push({ name: 'ResumeGameGmp', params: { gmpId } });
})



onMounted(() => {
  const storedEndTime: any = localStorage.getItem('endTime');
  if (storedEndTime) {
    const currentTime = Math.floor(Date.now() / 1000);
    timeLeft.value = Math.max(0, storedEndTime - currentTime);
  } else {
    const endTime: any = Math.floor(Date.now() / 1000) + initialTime;
    localStorage.setItem('endTime', endTime);
  }
  startTimer();
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <h1>Guess My Prompt</h1>
  <img :src="state.img" alt="">
  <div>
    <form @submit.prevent="submitPrompt">
      <div>
        <input type="text" v-model="prompt" id="prompt" />
      </div>
      <button type="submit">Soumettre</button>
    </form>
    <div>
      <p>
        Temps restant : {{ timeLeft }} secondes
      </p>
      <p>
        tours {{ state.turn }}
      </p>
    </div>
  </div>
</template>

<style>
</style>
