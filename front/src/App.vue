<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toast from './components/Toast.vue';
import NavBar from './components/NavBar.vue';
</script>

<template class="test">
  <Toast />
  <NavBar />
  <RouterView />
</template>