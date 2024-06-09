<script setup lang="ts">
import chat from '../components/Chat.vue';
import { ref } from 'vue';
</script>
<template>
  <chat :roomId="1" roomName="chat Général" />
</template>