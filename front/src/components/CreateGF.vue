<script setup lang="ts">
import { ref } from 'vue'
import apiHelper from '@/helpers/apiHelper';
import { useUtilsStore } from '@/stores/utilsStore';
import router from '@/router';

const roomName = ref('')
const showToast = useUtilsStore().showToast;

interface CreationRoomResponse {
  success: boolean;
  data: {
    id: string;
  };
}
const createRoom = async() => {
  const res = await apiHelper.kyPost('garticPhone/create', { name: roomName.value }, localStorage.getItem('token') as string) as CreationRoomResponse;
    if(!res.success) {
        showToast('erreur lors de la création de partie', false);
    }else{
      const lobbyId = res.data.id;
      router.push({ name: 'lobby', params: { lobbyId } });
    }
  roomName.value = ''
}
</script>

<template>
    <main>
      <form @submit.prevent="createRoom">
          <input id="room-name" v-model="roomName" type="text" required>
          <button type="submit">Create</button>
    </form>
    </main>
</template>

<style scoped lang="scss">

</style>
