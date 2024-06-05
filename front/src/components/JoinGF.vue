<script setup lang="ts">
import { ref } from 'vue';
import apiHelper from '@/helpers/apiHelper';
import router from '@/router';
import { useUtilsStore } from '@/stores/utilsStore';

const roomId = ref<string>('');
const showToast = useUtilsStore().showToast;

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
    <form @submit.prevent="JoinRoom">
      <input id="room-name" v-model="roomId" type="text" required />
      <button type="submit">Join</button>
    </form>
  </main>
</template>

<style scoped lang="scss">
/* Add your scoped styles here if needed */
</style>
