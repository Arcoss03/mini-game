<script setup lang="ts">
import { ref } from 'vue';
import Create from './CreateGP.vue';
import Join from './JoinGP.vue';
import NavBar from './NavBar.vue';
import router from '@/router';

const currentComponent = ref<string | null>(null);

const navigateToCreate = () => {
  currentComponent.value = 'Create';
  router.push('/createGP');
};

const navigateToJoin = () => {
  currentComponent.value = 'Join';
  router.push('/joinGP');
};
</script>

<template>
  <NavBar />
  <main>
    <div class="container">
      <h1>Guess My Prompt</h1>
      <button class="create" @click="navigateToCreate">CREATE</button>
      <button class="join" @click="navigateToJoin">JOIN</button>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100vh;
  background-color: #211D2A;
  
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1{
    line-height:4.5rem;
    margin-top: 5rem;
    margin-bottom: 5rem;
    font-size:9vh;
    max-width: 30rem;
    text-align: center;
    font-style: italic;
    font-weight: bold;

  }
  button {
    align-items: center;
    appearance: none;
    border: 0;
    border-radius: 15px;
    box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    height: 60px;
    justify-content: center;
    line-height: 1;
    list-style: none;
    margin: 10px;
    overflow: hidden;
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
    font-weight: bold;
    font-family:Arial, Helvetica, sans-serif;
    min-width: 9rem;
    margin-bottom: 3rem;

    &.create{
      background: red;

      &:focus {
      box-shadow: #ff4e50 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #ff4e50 0 -3px 0 inset;
    }
    &:active {
      box-shadow: #ff4e50 0 3px 7px inset;
      transform: translateY(2px);
    }
    &:hover {
      box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #ff4e50 0 -3px 0 inset;
      transform: translateY(-2px);
    }
    }


    &.join{
      background: #7520FF;
      
      &:focus {
      box-shadow: #6C63FF 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6C63FF 0 -3px 0 inset;
    }
    &:active {
      box-shadow: #6C63FF 0 3px 7px inset;
      transform: translateY(2px);
    }
    &:hover {
      box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6C63FF 0 -3px 0 inset;
      transform: translateY(-2px);
    }
    }
  }
}

  
}
</style>
