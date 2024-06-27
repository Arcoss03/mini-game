<script setup lang="ts">

import { onMounted, ref, type Ref} from 'vue';
import { useUtilsStore } from '@/stores/utilsStore';
import { useRouter } from 'vue-router';
import Chat from './Chat.vue';

let searchTerm = ref('');
let router = useRouter();

const submitForm = () => {
  router.push(`/profil/${searchTerm.value}`);
};

</script>


<template>
    <main class="home">
        <form  @submit.prevent="submitForm">
            <div class="search">
                <input type="text" name="test" v-model="searchTerm" placeholder="recherche">
                <button type="submit"><img src="../assets/search.svg" alt=""></button>
            </div>
        </form>

        <div class="chatbox">
            <chat :roomId="1" roomName="" maxHeight="100rem"  class="chat" />
        </div>
    </main>
</template>

<style scoped lang="scss">
main {
    min-height: 100vh;
    background: var(--bg-color);
    border: solid var(--bg-color-elements);
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 100%;

    .search {
        display: none;
    }
    .chatbox {
        display : none;
    }

    @media (min-width: 769px)  {
        .search {
            display: flex;
            //position temporaire 
            position: fixed;
            top: 1%;
            right: 0;

            input {
                width: 250px;
                height: 40px;
                border: 2px solid var(--color-text);
                border-radius: 8px;
            }
            button {
                width: 40px;
                height: 40px;
                border: solid #fff;
                border-radius: 8px;
                color: var(--color-text);
            }
        }
        .chatbox {
            display: flex;
            width: 500px;
        }
    }


    
}
</style>
