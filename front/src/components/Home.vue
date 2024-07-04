<script setup lang="ts">

import { onMounted, ref, type Ref } from 'vue';
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
        <div class="feed">
            <form @submit.prevent="submitForm">
                <div class="search">
                    <input type="text" name="test" v-model="searchTerm" placeholder="recherche">
                    <button type="submit">
                        <img src="../assets/search.svg" alt="">
                    </button>
                </div>
            </form>
            <div class="feed-container">

            </div>

        </div>
        <div class="chat-container">
            <chat :roomId="1" roomName="" maxHeight="100rem" class="chat" />
        </div>
    </main>
</template>

<style scoped lang="scss">
.home {
    min-height: 100vh;
    background: var(--bg-color);
    border: solid var(--bg-color-elements);
    display: flex;
    width: 100%;
    overflow: hidden;

    .feed {
        flex: 1;
        margin: 2rem;

        .search {
            display: flex;
            

            input {
                padding-left: 1rem;
                width: 250px;
                height: 40px;
                border: 2px solid var(--color-text);
                border-radius: 8px;
            }

            button {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 40px;
                height: 40px;
                border: solid #fff;
                border-radius: 8px;
                color: var(--color-text);
            }
        }
    }

    .chat-container {
        display: none;
    }

    @media (min-width: 1024px) {
        .feed {
            flex: 1.4;
        }

        .chat-container {
            display: block;
            flex: 0.6;
            width: 100%;
            height: 100vh;
            border-left: solid 10px var(--bg-color-elements);
        }
    }



}
</style>
