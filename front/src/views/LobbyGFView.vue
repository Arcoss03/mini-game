<script setup lang="ts">
import { defineProps } from 'vue';
import LobbyGF from '@/components/LobbyGF.vue';

const props = defineProps<{ lobbyId: string }>();
</script>

<template>
  <LobbyGF :lobbyId="props.lobbyId" />
</template>