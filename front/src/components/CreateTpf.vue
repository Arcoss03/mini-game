<script setup lang="ts">
import ky from 'ky';
import {type Post} from '@/interfaces/post';
import { useUtilsStore } from '@/stores/utilsStore';
import { onMounted, ref, type Ref } from 'vue';
import apiHelper from '../helpers/apiHelper';
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
import GenerateImgPopup from './popups/generateImgPopup.vue';

const showToast = useUtilsStore().showToast;

let text1: Ref<string> = ref('');
let text2: Ref<string> = ref('');

const popupIsVisible = ref(false);

const closePopup = () => {
  popupIsVisible.value = false;
  text1.value = '';
  text2.value = '';
};

const callPopupGeneration = () => {
  if (text1.value && text2.value) {
    popupIsVisible.value = true;
  } else {
    showToast('Veuillez remplir les deux champs', false);
  }
};
</script>

<template>
  <GenerateImgPopup v-if="popupIsVisible" :is-visible="popupIsVisible" :close-popup="closePopup" :text1="text1" :text2="text2" />
  <main>
    <!-- <img src="../assets/logoMG.svg" alt="logo"> -->
    <div class="desc-create">
      <h2>Créé ton propre “ Tu-Préfères ? “ !</h2>
      <p>Ajoute 2 propositions et l'intelligence supérieure artificielle se charge de te créer de superbes images !</p>
    </div>
    <form @submit.prevent="callPopupGeneration()">
      <h3>Tu préfères</h3>
      <div class='prompt-input'>
        <input v-model="text1">
      </div>
      <h3>ou</h3>
      <div class='prompt-input'>
        <input v-model="text2">
      </div>
      <button class="button" type=submit>Générer</button>
    </form>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
  width: 100%;
  padding: 0 2rem;
  background-color: #211D2A ;
  overflow: hidden;
  font-weight: 400;
  font-style: normal;
  

  .small-svg {
    border: solid;
    border-radius: 30%;
    width: 30%;
    height: 17%;
    margin-top: -30%;
    margin-bottom: 15%
  }

  .prompt-input {
    display: flex;
    flex-direction: column;
    width: 100%;

    input {
      width: 80vw;
      height: 40px;
      padding: 1rem;
      border: 2px solid #fff;
      border-radius: 8px;
      outline: none;
      font-size: 16px;
      margin-bottom: 1rem;
    }
    @media screen and (min-width: 1024px){
      input {
        width: 40vw;
      }
      padding-bottom: 2rem;
      
    }
  }

  button {
    background-color: #7520FF;
    height: 3rem;
    font-size: 18px;
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
  .desc-create {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    color: white;
    font-size: 1.5em;
    font-weight: 300;
    font-style: normal;
  }
  img {
    width: 250px;
    height: 250px;
  }


}
</style>