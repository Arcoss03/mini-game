<script setup lang="ts">
import ky from 'ky';
import {type Post} from '@/interfaces/post';
import { useUtilsStore } from '@/stores/utilsStore';
import { onMounted, ref, type Ref } from 'vue';
import apiHelper from '../helpers/apiHelper';
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
const currentUser = useUserStore().currentUser;

const showToast = useUtilsStore().showToast;

let text1: Ref<string> = ref('');
let text2: Ref<string> = ref('');
let toastMessage = ref('');
let toastStatus = ref(false);
let isToastVisible = ref(false);


async function SendPost() {
    // Utiliser ky pour obtenir les données des images
    const token = localStorage.getItem('token');
    const userId = currentUser?.id;
    if (!token || !userId) {
      router.push('/login');
      return;
    }

    if (text1.value === '' || text2.value === '') {
      showToast('Please fill in both prompts', false);
      return;
    }

    const postData: Post = {
      prompt1: text1.value,
      img_url1: '',
      nb_clic1: 0,
      prompt2: text2.value,
      img_url2: '',
      nb_clic2: 0,
      author_id: userId,
    };

    const res = await apiHelper.kyPostLongTimeout('tpf', postData, token);

    if (res.success) {
      showToast('Post created', true);
      text1.value = '';
      text2.value = '';
    } else {
      showToast('Failed to create post', false);
    }
  }

</script>

<template>
  <main>
    <!-- <img src="../assets/logoMG.svg" alt="logo"> -->
    <div class="desc-create">
      <h2>Créé ton propre "Tu-préfères?" !</h2>
      <p>Ajoute 2 propositions et l'intelligence supérieure artificielle se charge de te créer de superbes images !</p>
    </div>
    <form @submit.prevent="SendPost()">
      <div class='prompt-input'>
        <label for="prompt1">First Prompt</label>
        <input v-model="text1">
      </div>
      <div class='prompt-input'>
        <label for="prompt2">Second Prompt</label>
        <input v-model="text2">
      </div>
      <button class="button" type=submit>Create</button>
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
  background-color: #211D2A ;
  overflow: hidden;
  font-weight: 400;
  font-style: normal;


  .toast {
    opacity: 0;

    &.show {
      opacity: 1;
    }
  }

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
    margin-bottom: 10%;

    input {
      width: 300px;
      height: 40px;
      padding: 8px;
      border: 2px solid #fff;
      border-radius: 8px;
      outline: none;
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
    align-items: center;
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