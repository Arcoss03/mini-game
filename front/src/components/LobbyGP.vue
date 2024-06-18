<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import apiHelper from '@/helpers/apiHelper';
import router from '@/router';
import socketClient from '../helpers/socketHelper'
import Chat from './Chat.vue';

const state = reactive({
  messages: [] as Array<[string, string, string]>,
  name: '',
  date: new Date(),
  isChef: false,
  chatRoom: 0 as number,
  maxHeight : ref('13rem')
});

const resize=()=>{
    if (window.innerWidth >= 1024) {
    state.maxHeight = '20rem';
  } else {
    state.maxHeight = '13rem';
  }
  }

const props = defineProps<{ lobbyId: string }>();


onMounted(async () => {  
  
  window.addEventListener('resize', resize );
  const res = await apiHelper.kyGetWithToken(`garticPhone/${props.lobbyId}`, localStorage.getItem('token') as string);
  if (!res.success) {
    router.push('/choice-gmp');
  } else {
    const chatRoom = await apiHelper.kyGetWithToken(`garticPhone/room/${props.lobbyId}`, localStorage.getItem('token') as string);
    if (!chatRoom.success) {
      router.push('/choice-gmp');
    }
    else {

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
      <div class="container-first">
        <h1>Guess My Prompt</h1>
        <div class="size-chat" v-if="state.chatRoom !== 0">
        <div  v-if="state.maxHeight=== '13rem'">
          <chat :roomId="state.chatRoom" roomName="" maxHeight="3rem" class="chat" />
        </div>
        <div v-if="state.maxHeight === '20rem'">
          <chat :roomId="state.chatRoom" roomName="" maxHeight="20rem" class="chat" />
        </div>
        </div>
        <p>{{ state.date }}</p>
      </div>
      <div class="container-second">
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
                  <img v-if="message[2]" class="crown" src="../assets/crown.svg" alt="">
                  <img v-if="!message[2]" class='skin_without_crown' :src="message[1]" alt="" />
                  <img v-if="message[2]" class="skin" :src="message[1]" alt="" />
                  <img v-if="message[1]" class="ellipseViolet" src="../assets/EllipseVioletRouge.svg" alt="">
                  <img v-if="!message[1]" class="ellipseRouge" src="../assets/EllipseRougeViolet.svg" alt="">
                  <strong>{{ message[0] }}</strong>
                </p>
              </li>
            </div>
            <div class="row">
              <li v-for="(message, index) in filledMessages().slice(4, 8)" :key="index">
                <p>
                  <img v-if="message[2]" class="crown" src="../assets/crown.svg" alt="">
                  <img v-if="!message[2]" class='skin_without_crown' :src="message[1]" alt="" />
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
    flex-direction: column-reverse;

    @media(min-width:1024px) {
      flex-direction: row;
    }



    .container-first {
      min-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      h1 {
        display: none;
      }


      .size-chat {
        width: 80%;

        .chat {
          border-radius: 1.5rem;
          background-color: #17141D;
          overflow-y: auto;
        }
      }



      p{
        display:none;
      }
       
      @media(min-width: 1024px) {
        min-width: 40%;
        align-items: flex-end;
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
        }
        p {
        display: block;
        margin-top: 10vh;
        font-size: 2.1vh;}
      }
    }

    .container-second {
      min-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      h1 {
        margin-top: 0.5rem;
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
        display: flex;
        justify-content: center;
        margin-top: 1rem;
        width: 100%;
        list-style-type: none;
        align-items: center;

        .container-player {
          display: flex;
          justify-content: center;
          flex-direction: column;

          .row {
            display: flex;
            flex-direction: row;

            li {
              p {
                display: flex;
                flex-direction: column;
                width: 80px;
                justify-content: center;
                align-items: center;

                img {
                  width: 35px;
                }
                .crown{
                  margin-top: 1rem;
                }

                .skin {
                  border-radius: 25%;
                  position: relative;
                  z-index: 2;
                }

                .skin_without_crown {
                  border-radius: 25%;
                  position: relative;
                  z-index: 2;
                  margin-top: 2.4rem;
                }

                .ellipseViolet {
                  width: 60px;
                  position: absolute;
                }

                .ellipseRouge {
                  width: 60px;
                  margin-top: 1rem;
                }

                strong {
                  margin-top: 1.4rem;
                  margin-bottom: 1rem;
                  font-size: 2vh;
                  font-style: italic;
                  font-weight: bold;
                }

                @media(min-width: 1024px) {
                  img {
                    width: 60px;
                  }

                  .ellipseViolet {
                    width: 90px;
                    margin-top: 2rem;
                  }

                  .ellipseRouge {
                    width: 90px;
                    margin-top: 2rem;
                  }
                  .skin_without_crown {
                  margin-top: 2.5rem;
                }
                .crown{
                  margin-top: 0rem;
                }
                }
              }

            }

          }

        }

      }

      @media(min-width: 1024px) {
        min-width: 60%;

        h1 {
          margin-top: 6rem;
        }

        ul {
          margin-top: 1rem;
          margin-bottom: 3rem;
          width: 70%;
          margin-bottom: 3rem;
          display: block;

          .container-player {
            display: flex;
            justify-content: center;
            flex-direction: column;

            .row {
              display: flex;
              flex-direction: row;
            }
          }
        }

        li {
          width: 30rem;
        }
      }
    }

    .position-button {
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
</style>
