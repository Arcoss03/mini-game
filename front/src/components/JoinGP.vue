<script setup lang="ts">
import { ref } from 'vue';
import apiHelper from '@/helpers/apiHelper';
import router from '@/router';
import { useUtilsStore } from '@/stores/utilsStore';
import socketHelper from '@/helpers/socketHelper';

const roomId = ref<string>('');
const showToast = useUtilsStore().showToast;
localStorage.removeItem('endTime');
socketHelper.disconnect();

interface JoinRoomResponse {
  success: boolean;
  data: {
    id: string; 
  };
}

const JoinRoom = async () => {
  const res = await apiHelper.kyPost('garticPhone/join', { id: roomId.value }, localStorage.getItem('token') as string) as JoinRoomResponse;
  if (!res.success) {
    showToast('erreur lors de la recupération de la partie', false);
  } else {
    const lobbyId = res.data.id;
    router.push({ name: 'lobby', params: { lobbyId } });
  }
  roomId.value = '';
};
</script>

<template>
  <main>
    <div class="container">
      <h1>Guess My Prompt</h1>
    <form @submit.prevent="JoinRoom">
      <input id="room-name" v-model="roomId" type="text" placeholder="ID Room" required />
      <div>
      <button class="button join" type="submit" >JOIN</button>
    </div>
    </form>
  </div>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100vh;
  background-color: var(--bg-color);
  
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1{
    line-height:4.5rem;
    margin-top: 5rem;
    margin-bottom: 6rem;
    font-size:9vh;
    max-width: 30rem;
    text-align: center;
    font-style: italic;
    font-weight: bold;
  }
form{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  input{
    padding: 0 2rem;
    border-radius: 15px;
    height: 40px;
    width: 11rem;
    font-size: 20px;
    font-weight: bold;
    font-family:Arial, Helvetica, sans-serif;
    margin-bottom: 1rem;

    &::placeholder{
      text-align: center;
    }
  }

  button {
    
    align-items: center;
    appearance: none;
    border: 0;
    border-radius: 15px;
    box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
    box-sizing: border-box;
    color: var(--color-text);
    cursor: pointer;
    display: inline-flex;
    height: 60px;
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
    font-family:Arial, Helvetica, sans-serif;
    min-width: 9rem;
    margin-bottom: 3rem;

    &.join{
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
