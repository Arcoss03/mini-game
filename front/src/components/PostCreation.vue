<script setup lang="ts">
import ky from 'ky';
import Toast from './Toast.vue';
import {type Post} from '@/interfaces/post';
import { useUtilsStore } from '@/stores/utilsStore';
import { onMounted, ref, type Ref } from 'vue';

const showToast = useUtilsStore().showToast;

let text1: Ref<string> = ref('');
let text2: Ref<string> = ref('');
let toastMessage = ref('');
let toastStatus = ref(false);
let isToastVisible = ref(false);


async function SendPost() {
  try {
    // Utiliser ky pour obtenir les données des images
    const data:any = await ky.get('https://api.thecatapi.com/v1/images/search?limit=2').json();

    if (text1.value === '' || text2.value === '') {
      showToast('Please fill in both prompts', false);
      return;
    }

    const postData: Post = {
      prompt1: text1.value,
      img_url1: data[0].url,
      nb_clic1: 0,
      prompt2: text2.value,
      img_url2: data[1].url,
      nb_clic2: 0,
      author_id: 1,
    };

    console.log(postData);

    // Utiliser ky pour envoyer les données
    await ky.post('/api/posts', {
      json: postData
    });

    showToast('Post created', true);
    text1.value = '';
    text2.value = '';
  } catch (error) {
    // Avec ky, une erreur est lancée automatiquement si la réponse n'est pas ok
    showToast('Failed to create post', false);
    console.error('Erreur lors de la requête :', error);
  }
}

</script>

<template>
  <main>
    <img src="../assets/logo.svg" alt="logo">
    <form @submit.prevent="SendPost()">
      <div class='prompt-input'>
        <label for="prompt1">First Prompt</label>
        <input v-model="text1">
      </div>
      <div class='prompt-input'>
        <label for="prompt2">Second Prompt</label>
        <input v-model="text2">
      </div>
      <button type=submit>Create</button>
    </form>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  background: linear-gradient(180deg, #EC1414 0%, #7D50DD 100%);
  overflow: hidden;
  font-family: "Anton", sans-serif;
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
      font-family: "Anton", sans-serif;
    }
  }

  button {
    padding: 0px 20px;
    border: solid #fff;
    border-radius: 20px;
    color: #fff;
  }


}
</style>