<script setup lang="ts">
import { ref, computed } from 'vue';
import Create from './CreateGF.vue';
import Join from './JoinGF.vue';

const currentComponent = ref<string | null>(null);
const showButtons = computed(() => currentComponent.value === null);
</script>

<template>
  <main>
    <h1>Guess Your Prompt</h1>
    <button class="create" v-if="showButtons" @click="currentComponent = 'Create'">Create</button>
    <button  class="join" v-if="showButtons" @click="currentComponent = 'Join'">Join</button>
    <Create v-if="currentComponent === 'Create'" />
    <Join v-if="currentComponent === 'Join'" />
  </main>
</template>

<style scoped lang="scss">
main {
  background-color: #211D2A;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;

  h1{
    margin-bottom: 5%;
    font-size:60px;
  }
  button {
    align-items: center;
    appearance: none;
    border: 0;
    border-radius: 6px;
    box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    height: 48px;
    justify-content: center;
    line-height: 1;
    list-style: none;
    margin: 10px;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
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
    font-family:Arial, Helvetica, sans-serif;
    width: 10%;

    &:focus {
      box-shadow: #ff4e50 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #ff4e50 0 -3px 0 inset;
    }
    &:hover {
      box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #ff4e50 0 -3px 0 inset;
      transform: translateY(-2px);
    }
    &:active {
      box-shadow: #ff4e50 0 3px 7px inset;
      transform: translateY(2px);
    }

    &.create{
      background: blue
    }
    &.join{
      background: red
    }
  }
}
</style>
