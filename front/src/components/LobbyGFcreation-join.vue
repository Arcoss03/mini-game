<script setup lang="ts">
import { ref,computed } from 'vue'
import Create from './CreateGF.vue'
import Join from './JoinGF.vue'

const currentComponent = ref<string | null>(null);
const showButtons = computed(() => currentComponent.value === null)

</script>


<template>
    <main>
      <button v-if="showButtons" @click="currentComponent = 'Create'">Create</button>
      <button v-if="showButtons" @click="currentComponent = 'Join'">Join</button>
    </main>
    <Create v-if="currentComponent === 'Create'" />
    <Join v-if="currentComponent === 'Join'" />
  </template>
  

<style scoped lang="scss">

</style>
