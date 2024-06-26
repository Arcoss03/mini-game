<script setup lang="ts">
import apiHelper from '@/helpers/apiHelper';
import router from '@/router';
import { io } from 'socket.io-client';
import { reactive } from 'vue';

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;
const socket = io(apiUrl, {
  auth: {
    apiKey: apiKey
  }
});


const props = defineProps<{ gmpId: string }>();
const res:any = await apiHelper.kyGetWithToken(`garticPhone/resume/${props.gmpId}`, localStorage.getItem('token') as string);
if (!res.success) {
  socket.disconnect()
    router.push('/choice-gmp');
    }else{
      console.log(res.data)
        
    }
</script>

<template>
  <h1>Guess My Prompt</h1>
  <div v-for="(item, index) in res.data" :key="index">
      <p v-for="(entry, innerIndex) in item" :key="innerIndex">
        <strong>{{ entry.pseudo }}</strong>: {{ entry.prompt }}
        <br />
        <img :src="entry.img_url" alt="User's image" style="max-width: 300px;" />
      </p>
    </div>
</template>

<style>
</style>
