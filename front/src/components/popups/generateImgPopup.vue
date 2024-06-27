<script setup lang="ts">
import apiHelper from '@/helpers/apiHelper';
import type { Post } from '@/interfaces/post';
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
import { defineProps, onMounted, ref } from 'vue'

const currentUser = useUserStore().currentUser;


const props = defineProps({
    isVisible: Boolean,
    closePopup: Function,
    text1: String,
    text2: String,
})

const imgIsGenerated = ref(false);
const generationStatus = ref(false);
const img_url1 = ref('');
const img_url2 = ref('');

onMounted(async() => {
    if (!props.text1 || !props.text2) {
      return;
    }
    await SendPost();

})

async function SendPost() {
    // Utiliser ky pour obtenir les données des images
    const token = localStorage.getItem('token');
    const userId = currentUser?.id;
    if (!token || !userId) {
        router.push('/login');
        return;
    }

    const postData: Post = {
        prompt1: props.text1!,
        img_url1: '',
        nb_clic1: 0,
        prompt2: props.text2!,
        img_url2: '',
        nb_clic2: 0,
        author_id: userId,
    };

    const res = await apiHelper.kyPostLongTimeout('tpf', postData, token);
    if (res.success) {
        imgIsGenerated.value = true;
        generationStatus.value = true;
        img_url1.value = res.data.img_url1 as string;
        img_url2.value = res.data.img_url2 as string;
    } else {
        imgIsGenerated.value = true;
        generationStatus.value = false;
    }
}

</script>

<template>
    <div class="screen" v-if="props.isVisible">
        <div class="popup">
            <div v-if="imgIsGenerated" class="isCall">
                <div v-if="generationStatus" class="success">
                    <h2>Tu-Préfères Généré</h2>
                    <div class="tpf">
                        <div class="or">OU</div>
                        <div>
                            <img class="first" :src="img_url1" alt="second img">
                            <h4>{{ text1 }}</h4>
                        </div>
                        <div>
                            <img class="second" :src="img_url2" alt="second img">

                            <h4>{{ text2 }}</h4>
                        </div>
                    </div>
                </div>
                <div v-else class="error">
                    <h2>Erreur lors de la génération</h2>
                </div>
                <button class="button" @click="props.closePopup">OK</button>
            </div>
            <div v-else class="whileGenerated">
                <div class="loading">
                    <h2>Tu-Préfères en cours de génération</h2>
                    <p>Veuillez patienter...</p>
                    <div class="progress-bar" :class="{ 'paused': imgIsGenerated }"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.screen {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);

    .popup {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        gap: 20px;
        background-color: #211D2A;
        border-radius: 12px;
        width: 90%;
        padding: 4rem;

        @media screen and (min-width: 1024px) {
            width: 50%;
        }
    }

    .isCall {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .success {
            width: 100%;

            .tpf {
                display: flex;
                font-size: 1rem;
                img {
                    display: flex;
                    width: 100%;
                    aspect-ratio: 1;
                    object-fit: cover;

                    &.first {
                        border-radius: 12px 0 0 12px;
                        border-right: #17141D 5px solid;
                    }
                    &.second {
                        border-radius: 0 12px 12px 0;
                        border-left: #17141D 5px solid;
                    }
                }
                text-align: center;

                .or {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 1rem;
                    color: #fff;
                    background-color: #17141D;
                    border: 3px solid #FFF;
                    border-radius: 999px;
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    @media screen and (min-width: 700px) {
                        font-size: 2rem;
                        width: 5rem;
                        height: 5rem;
                    }
                    
                }

                @media screen and (min-width: 1024px) {
                    font-size: 1.3rem;
                    
                }
            }
        }
    }

    .whileGenerated {
        .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #fff;
            border-radius: 10px;
            position: relative;
            overflow: hidden;

            &:after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                background-image: linear-gradient(90deg, #EC1414 0.16%, #7D50DD 99.9%);
                animation: progress 1s linear infinite;
            }

            &.paused:after {
                animation-play-state: paused;
            }

            @keyframes progress {
                0% {
                    transform: translateX(-100%);
                }

                100% {
                    transform: translateX(100%);
                }
            }
        }
    }

}

button {
    background-color: #7520FF;
    height: 3rem;
    font-size: 18px;
    margin: 0;
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
</style>
