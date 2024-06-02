<script setup lang="ts">
import { reactive, ref, onUpdated } from 'vue';
import socketClient from '../helpers/chatHelper';

const props = defineProps({
    roomName: String,
    roomId: Number,
});

let room = props.roomId;
const state = reactive({
  messages: [] as { pseudo: string; content: string; color: string }[],
  textArea: '',
  taille: 0,
});

const MAX_CHARACTERS = 244;
const messageList = ref<HTMLElement | null>(null); 
const chatHeight = ref('calc(100vh - 10rem)'); 
const textareaRef = ref<HTMLTextAreaElement | null>(null);

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
  const content = state.textArea.slice(0, MAX_CHARACTERS);
  socketClient.message(localStorage.getItem('token') as string, content, room as number);
  state.textArea = '';
  state.taille = 0;
  scroll.value = true;
  resetTextarea();
};

socketClient.messageResponse(state.messages);
socketClient.invalidToken();

const onInput = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  resizeTextarea(textarea);
};

const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto'; // Réinitialiser la hauteur
  if (textarea.scrollHeight > 48) {
    textarea.style.height = `${textarea.scrollHeight + 16}px`; // Ajuster à la hauteur du contenu
    chatHeight.value = `calc(100vh - ${textarea.scrollHeight + 32}px - 5rem)`; // 32px is the padding and margin combined
  } else {
    chatHeight.value = 'calc(100vh - 10rem)'; 
  }
};

const resetTextarea = () => {
  chatHeight.value = 'calc(100vh - 10rem)';
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'; // Réinitialiser la hauteur du textarea
  }
};

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
        <li v-for="(message, index) in state.messages" :key="index" class="message-item">
          <strong class="pseudo" :style="{ color: message.color }">{{ message.pseudo }}:</strong>
          <span class="content">{{ message.content }}</span>
        </li>
      </ul>
        <div class="textarea-container">
          <textarea
              v-model="state.textArea"
              ref="textareaRef"
              @input="onInput"
              :maxlength="MAX_CHARACTERS"
              type="text"
              placeholder="Saisissez votre message..."
              @keydown.enter.prevent="sendMessage">
            </textarea>
        </div>
    </div>
  </main>
  </template>
  
  

<style scoped lang="scss">
main {
  background-color: #211D2A;
  .barre {
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
  .textarea-container {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    background: white;
    width: 80%;
    margin: 1rem 0 0 1rem;
    padding: 0 1rem;
  }
  textarea {
    width: 100%;
    resize: none;
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
    background: none;
    border: none;
    padding: 0;
    line-height: 1rem;
    padding-top: 1rem;
    font-size: 1rem;
    &::placeholder {
      font-size: 1rem;
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
      li {
        word-break: break-word;
        color: #fff;
        .message {
          display: flex;
          flex-wrap: wrap;
        }
        .pseudo {
          margin-right: 0.5rem;
        }
        .content {
          flex: 1;
          word-break: break-word;
        }
      }
    }
  }
}
</style>
