<script setup lang="ts">
import { ref } from 'vue';;
import router from '@/router';

const currentComponent = ref<string | null>(null);
  localStorage.removeItem('endTime');
const navigateToCreate = () => {
  currentComponent.value = 'Create';
  router.push('/create/gmp');
};

const navigateToJoin = () => {
  currentComponent.value = 'Join';
  router.push('/join/gmp');
};
</script>

<template>
  <main>
    <div class="container">
      <h1>Guess My Prompt</h1>
      <button class="button create" @click="navigateToCreate">CREATE</button>
      <button class="button join" @click="navigateToJoin">JOIN</button>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  width: 100%;
  height: 100vh;
  background-color: #211D2A;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    h1 {
      line-height: 4.5rem;
      margin-top: 5rem;
      margin-bottom: 5rem;
      font-size: 9vh;
      max-width: 30rem;
      text-align: center;
      font-style: italic;
      font-weight: bold;

    }

    button {

      &.create {
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


      &.join {
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
