<script setup lang="ts">
import { reactive, ref, onUpdated, watch } from 'vue';
import socketClient from '../helpers/chatHelper';

const props = defineProps({
    roomName: String,
    roumId: Number,
  });

let room = props.roumId;
const state = reactive({
  messages: [] as { pseudo: string; content: string; color: string }[],
  textArea: '',
  taille: 0,
});

const messageList = ref<HTMLElement | null>(null); 
const textAreaHeight = ref(24);
const chatHeight = ref('calc(37rem - 24px)'); 

const scroll = ref(true);

const scrollHandler = () => {
  if (messageList.value && scroll.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }
};

const handleScroll = () => {
  if (messageList.value) {
    const { scrollTop, clientHeight, scrollHeight } = messageList.value;
    scroll.value = scrollTop + clientHeight >= scrollHeight;
  }
};

state.messages.splice(0, state.messages.length);
socketClient.quitRoom();
socketClient.joinRoom(localStorage.getItem('token') as string, room as number);

const sendMessage = () => {
  const content = state.textArea;
  socketClient.message(localStorage.getItem('token') as string, content, room as number);
  state.textArea = '';
  state.taille = 0;
  scroll.value = true;
  textAreaHeight.value = 38; 
  updateChatHeight();
};

socketClient.messageResponse(state.messages);
socketClient.invalidToken();

const onInput = (event: any) => {
  event.target.style.height = '2.4rem';
  event.target.style.height = `${event.target.scrollHeight}px`;
  textAreaHeight.value = Math.min(event.target.scrollHeight, 100); // Limiter la hauteur à 100px

  if (event.target.scrollHeight >= 100) {
    event.target.style.overflow = 'auto';
    event.target.style.paddingRight = "0.7rem";
  } else {
    event.target.style.overflow = 'hidden';
  }

  const a = 2;
  const b = 0.7;
  const y = a * Math.exp(-b * event.target.scrollHeight) + 2;
  const radius = y;

  event.target.style.borderRadius = `${radius}rem`;
  updateChatHeight();
};

const updateChatHeight = () => {
  const maxChatHeight = 37 * 16;
  const newChatHeight = maxChatHeight - textAreaHeight.value;
  chatHeight.value = `calc(37rem - ${textAreaHeight.value-14}px)`;
};

watch(textAreaHeight, updateChatHeight);

onUpdated(() => {
  if (scroll.value) {
    scrollHandler();
  }
});
</script>

<template>
<main style="height: 100%;">
  <h1>{{props.roomName}}</h1>
  <div class="barre"></div>
  <div class="chat">
    <ul :style="{ height: chatHeight }" ref="messageList" @scroll="handleScroll">
      <li v-for="(message, index) in state.messages" :key="index">
        <p>
          <strong class="pseudo" :style="{ color: message.color }">{{ message.pseudo }} :</strong>
          {{ message.content }}
        </p>
      </li>
    </ul>
    <form>
      <div class="textarea-container">
        <textarea
          v-model="state.textArea"
          style="height: 2.4rem;"
          @input="onInput"
          type="text"
          placeholder="Saisissez votre message..."
          @keydown.enter.prevent="sendMessage"
        ></textarea>
      </div>
    </form>
  </div>
</main>
</template>

<style scoped lang="scss">
main {
  background-color: #211D2A;
  .barre{
    margin-left: 2rem;
    border-radius: 2rem;
    height: 0.15rem;
    width: 80%;
    background: linear-gradient(to right, #EC1414 0%, #7D50DD 100%);
  }
  h1 {
    margin-left: 2.2rem;
  }
  ul {
    list-style-type: none;
  }
  form {
    margin-top: 1%;
    .textarea-container {
      margin-left: 1rem;
      padding-right: 1.5rem;
      border-radius: 2rem;
      background: white;
      width: 80%;
      
    }
    textarea {
      padding: 0.7rem 1rem 0.7rem 2rem;
      width: 100%;
      resize: none;
      overflow: hidden;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      line-height: 1rem;
      max-height: 100px;
      background: none;
      border: none;
      &::placeholder {
        line-height: 1rem;
        font-size: 14px;
      }
      &::-webkit-scrollbar {
        width: 6px;
        background-color: transparent;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 6px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
      &:focus,
      &:active {
        border: none;
        outline: none;
      }
    }
  }
  .pseudo {
    font-weight: 490;
  }
  .chat {
    margin-top: 1rem;
    ul {
      overflow: auto;
      &::-webkit-scrollbar {
        width: 6px;
        background-color: transparent;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 6px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
      &:focus,
      &:active {
        border: none;
        outline: none;
      }
    }
  }
}
</style>

