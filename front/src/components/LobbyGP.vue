<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import apiHelper from '@/helpers/apiHelper';
import router from '@/router';
import socketClient from '../helpers/socketHelper'
import Chat from './Chat.vue';

const state = reactive({
  messages: [] as Array<[string, string, string]>,
  name: '',
  date: new Date(),
  isChef: false,
  chatRoom:0 as number
});

const props = defineProps<{ lobbyId: string }>();
onMounted(async () => {
  const res = await apiHelper.kyGetWithToken(`garticPhone/${props.lobbyId}`, localStorage.getItem('token') as string);
  if (!res.success) {
    router.push('/choice-gmp');
  } else {
    const chatRoom=await apiHelper.kyGetWithToken(`garticPhone/room/${props.lobbyId}`, localStorage.getItem('token') as string);
    if (!chatRoom.success) {
      router.push('/choice-gmp');
  }
      else{
       
        state.chatRoom = chatRoom.data.roomChat as number;
        
    let room: any = res.data.room;
    state.name = room.name;
    state.date = new Date(room.creation_date);

    socketClient.joinLobby(localStorage.getItem('token') as any, props.lobbyId);
    socketClient.handleJoinedRoom(state)
    socketClient.handleChef(state)
     }
  }
});

const startGame = async () => {
  const res = await apiHelper.kyPost(`garticPhone/play`, { id: props.lobbyId }, localStorage.getItem('token') as string);
  if (!res.success) {
    router.push('/login');
  }
};


// Ensure there are always 8 elements in state.messages
const filledMessages = () => {
  const messagesCopy = [...state.messages];
  while (messagesCopy.length < 8) {
    messagesCopy.push(['', '', '']);
  }
  return messagesCopy;
};
</script>


<template>
  <main>
    <div class="container">
      <div class="container-left">
        <h1>Guess My Prompt</h1>
        <div class="size-chat" v-if="state.chatRoom !== 0">
          <chat :roomId="state.chatRoom" roomName="" maxHeight="20rem" class="chat" />
        </div>
        <p>{{ state.date }}</p>
      </div>
      <div class="container-right">
        <h1>Lobby {{ props.lobbyId }}</h1>
        <div class="flex-mid">
          <h2>{{ state.name }}</h2>
          <h2>{{ state.messages.length }}/8</h2>
        </div>
        <ul>
          <div class="container-player">
            <div class="row">
              <li v-for="(message, index) in filledMessages().slice(0, 4)" :key="index">
                <p>
                  <img v-if="message[2]" src="../assets/crown.svg" alt="">
                  <img v-if="!message[2]" style="margin-top: 2rem ;" class="skin" :src="message[1]" alt="" />
                  <img v-if="message[2]" class="skin" :src="message[1]" alt="" />
                  <img v-if="message[1]" class="ellipseViolet" src="../assets/EllipseVioletRouge.svg" alt="">
                  <img v-if="!message[1]" style="margin-top: 2.5rem;" class="ellipseRouge"
                    src="../assets/EllipseRougeViolet.svg" alt="">
                  <strong>{{ message[0] }}</strong>
                </p>
              </li>
            </div>
            <div class="row">
              <li v-for="(message, index) in filledMessages().slice(4, 8)" :key="index">
                <p>
                  <img v-if="message[2]" src="../assets/crown.svg" alt="">
                  <img v-if="!message[2]" style="margin-top: 2.5rem;" class="skin" :src="message[1]" alt="" />
                  <img v-if="message[2]" class="skin" :src="message[1]" alt="" />
                  <img v-if="message[1]" class="ellipseViolet" src="../assets/EllipseVioletRouge.svg" alt="">
                  <img v-if="!message[1]" class="ellipseRouge" src="../assets/EllipseRougeViolet.svg" alt="">
                  <strong>{{ message[0] }}</strong>
                </p>
              </li>

            </div>
          </div>
        </ul>
        <div class="position-button">
          <button class="blue" v-if="state.isChef" @click="startGame">Play</button>
        </div>
        
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

    .container-left {
      min-width: 40%;
      max-width: 40%;
      display: flex;
      flex-direction: column;
      align-items: flex-end ;

      h1 {
        line-height: 100%;
        margin-top: 1rem;
        margin-bottom: 3rem;
        font-size: 9vh;
        max-width: 30rem;
        font-style: italic;
        font-weight: bold;
        text-align: center;
      }

      .size-chat{
        width: 80%;
        .chat {
        border-radius: 1.5rem;
        background-color: #17141D;
        overflow-y: auto;
      }
      }
      
      

      p {
        margin-top: 10vh;
        font-size: 2.1vh;
      }
    }

    .container-right {
      min-width: 60%;
      max-width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;

      h1 {
        margin-top: 6rem;
        font-size: 4vh;
        max-width: 30rem;
        font-style: italic;
        font-weight: bold;
      }

      .flex-mid {
        min-width: 90%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;

        h2 {
          align-items: left;
          margin-top: 2rem;
          font-size: 3vh;
          max-width: 30rem;
          font-style: italic;
          font-weight: bold;
        }
      }

      ul {
        margin-top: 3rem;
        margin-bottom: 3rem;
        width: 70%;
        list-style-type: none;

        .container-player {
          display: flex;
          flex-direction: column;

          .row {
            display: flex;
            flex-direction: row;

            li {
              width: 30rem;

              p {
                display: flex;
                flex-direction: column;
                width: 100px;
                justify-content: center;
                align-items: center;

                img {
                  width: 60px;
                }

                .skin {
                  border-radius: 25%;
                  position: relative;
                  z-index: 2;
                }

                .ellipseViolet {
                  width: 90px;
                  position: absolute;
                  margin-top: 1.9rem;

                }

                .ellipseRouge {
                  width: 90px;
                  margin-top: 2.5rem;
                }

                strong {
                  margin-top: 1.4rem;
                  margin-bottom: 1rem;
                  font-size: 2vh;
                  font-style: italic;
                  font-weight: bold;
                }
              }

            }
          }

        }
      }
      .position-button{
        display: flex;
        flex-direction: row;
        justify-content: end;
        button {
        align-items: center;
        appearance: none;
        border: 0;
        border-radius: 15px;
        box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;
        display: inline-flex;
        height: 40px;
        justify-content: center;
        line-height: 1;
        list-style: none;
        margin: 10px;
        overflow: hidden;
        position: relative;
        text-align: center;
        text-decoration: none;
        transition: box-shadow 0.15s, transform 0.15s;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        white-space: nowrap;
        will-change: box-shadow, transform;
        font-size: 20px;
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        min-width: 9rem;

        &.blue {
          background: #7520FF;

          &:focus {
            box-shadow: #6C63FF 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6C63FF 0 -3px 0 inset;
          }

          &:active {
            box-shadow: #6C63FF 0 3px 7px inset;
            transform: translateY(2px);
          }

          &:hover {
            box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6C63FF 0 -3px 0 inset;
            transform: translateY(-2px);
          }
        }
      }
      }

      

    }
  }
}
</style>
