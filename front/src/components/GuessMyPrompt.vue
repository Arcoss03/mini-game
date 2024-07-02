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
  turn: 0,
});

const props = defineProps<{ gmpId: string }>();

const prompt = ref('');
const initialTime = 10;
const timeLeft = ref(initialTime);
let timer: any = null;
let last: any = null;
let genere: boolean = true;

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
  if (genere == true) {
    if (prompt.value === '') {
      prompt.value = "Quand tu réalises que même un œuf a une meilleure chance de devenir quelque chose de plus extraordinaire que toi";
    }
    const data: any = await ky.get('https://api.thecatapi.com/v1/images/search?limit=1').json();
    socket.emit("createPrompt", { token: localStorage.getItem('token'), roomId: props.gmpId, prompt: prompt.value, data: data[0].url, timer: timeLeft.value, turn: state.turn, last: last }); socket.emit("createPrompt", { token: localStorage.getItem('token'), roomId: props.gmpId, prompt: prompt.value, data: data[0].url, timer: timeLeft.value, turn: state.turn, last: last });
    genere=false;
  }

  clearInterval(timer);

  timeLeft.value = 0;
  localStorage.removeItem('endTime');
};

socket.on("nextPrompt", (data) => {
  genere=true;
  state.turn = data.turn + 1;
  last = data.id;
  state.img = data.img;
  // Reset the timer when a new prompt is received
  timeLeft.value = initialTime;
  const endTime: any = Math.floor(Date.now() / 1000) + initialTime;
  localStorage.setItem('endTime', endTime);
  startTimer(); // Restart the timer
});


socket.on("resume", () => {
  let gmpId = props.gmpId
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
  <main>
    <div class="container">
      <h1>Guess My Prompt</h1>
      <div class="info">
        <p>
          Temps restant : {{ timeLeft }} s
        </p>
        <p>
          Tours {{ state.turn }}
        </p>
      </div>
      <div class="image">
        <img v-if="state.img" :src="state.img" alt="">
      </div>
      <div class="form">
        <form @submit.prevent="submitPrompt">
          <input type="text" v-model="prompt" id="prompt" placeholder="Saisir votre prompt">
          <div class="positionButton">
            <button type="submit" class="create button">SOUMETTRE</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100%;
  background-color: #211D2A;

  .container {
    display: flex;
    flex-direction: column;

    h1 {
      display: block;
      line-height: 100%;
      margin-top: 1rem;
      margin-bottom: 3rem;
      font-size: 9vh;
      max-width: 30rem;
      font-style: italic;
      font-weight: bold;
      text-align: center;

      @media(min-width: 1024px) {
        margin-top: 0.5rem;
        max-width: 100%;
        text-align: justify;
        margin-left: 8%;
      }
    }

    .image {
      display: flex;

      img {
        margin-top: 5rem;
        max-width: 20rem;
        border: solid red;
        border-radius: 16px;

        @media(min-width: 1024px) {
          min-width: 30rem;
          margin-top: 2rem;
        }
      }

      justify-content: center;
    }



    .form {
      min-width: 90%;
      margin-top: 5rem;
      display: flex;
      flex-direction: column;

      .positionButton {
        margin-top: 1rem;
        text-align: center;

        .create {
          background: red;
          height: 2.5rem;

          &:focus {
            box-shadow: #ff4e50 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #ff4e50 0 -3px 0 inset;
          }

          &:active {
            box-shadow: #ff4e50 0 3px 7px inset;
            transform: translateY(2px);
          }

          &:hover {
            box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #ff4e50 0 -3px 0 inset;
            transform: translateY(-2px);
          }

          @media(min-width: 1024px) {
            height: 3rem;
            margin-left: 10%;
          }

        }


      }


      input {
        background: white;
        width: 90%;
        margin: 1rem 0 0 1rem;
        padding: 0 1rem;
        height: 2.5rem;
        border-radius: 12px;
        font-size: 1rem;
        font-family: Arial, Helvetica, sans-serif;

        &::placeholder {
          font-size: 1rem;
        }

      }

      @media(min-width: 1024px) {
        text-align: end;
        width: 80%;
        margin-top: 2rem;
      }
    }

    .info {
      margin: 1rem 1rem 0;
      display: flex;
      justify-content: space-between;

      @media(min-width: 1024px) {
        margin-left: 10%;
        margin-right: 10%;
        margin-top: 0.5rem;
      }
    }



  }
}
</style>
