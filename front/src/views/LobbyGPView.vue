<script setup lang="ts">
import { defineProps } from 'vue';
import LobbyGP from '@/components/LobbyGP.vue';

const props = defineProps<{ lobbyId: string }>();
</script>

<template>
  <LobbyGP :lobbyId="props.lobbyId" />
</template>