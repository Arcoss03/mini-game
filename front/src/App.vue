<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toast from './components/Toast.vue';
import NavBar from './components/NavBar.vue';
import { onMounted } from 'vue';
import { useUserStore } from './stores/userStore';
import { useUtilsStore } from './stores/utilsStore';

onMounted( async() => {
  useUtilsStore().initializeTheme();
})
</script>

<template class="test">
  <RouterView />
  <Toast />
  <NavBar :profil_picture="useUserStore().currentUser?.profil_picture ?? ''"/>
</template>