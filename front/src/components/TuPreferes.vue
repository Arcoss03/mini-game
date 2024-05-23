<script setup lang="ts">
import type { Post } from '@/interfaces/post';
import ky from 'ky';
import { onMounted, ref, type Ref } from 'vue';
import apiHelper from '../helpers/apiHelper'
import { useUtilsStore } from '@/stores/utilsStore';

const showToast = useUtilsStore().showToast;
let img1IsActive = ref(false);
let img2IsActive = ref(false);
let postTab: Ref<Post[]> = ref([]);
let tabPosition: Ref<number> = ref(0);


const setImg1 = () => {
  if(!img1IsActive.value && !img2IsActive.value && postTab.value.length !== 0) {
    img1IsActive.value = true;
    img2IsActive.value = false;
    vote(postTab.value[tabPosition.value].id!, 1);
  }
};

const setImg2 = () => {
  if(!img1IsActive.value && !img2IsActive.value) {
    img1IsActive.value = false;
    img2IsActive.value = true;
    
    vote(postTab.value[tabPosition.value].id!, 2);
  }
};

async function getAllPosts(): Promise<Post[] | undefined> {
  const res = await apiHelper.kyGet('tpf');
    if(!res.success) {
        showToast('Erreur lors du chargement des tu préfères', false);
    } else {
        return res.data as unknown as Post[]
    }
}

const vote = async (id: number, selectedClick: number) => {
  const res = await apiHelper.kyPutWithoutToken(`tpf/vote/${id}`, {"selectedClick": selectedClick} );
  if(!res.success){
    showToast('Erreur lors du vote', false);
  }
};

const nextPost = () => {
  tabPosition.value++;
  if (tabPosition.value >= postTab.value.length) {
    tabPosition.value = 0;
  }
  img1IsActive.value = false;
  img2IsActive.value = false;
};

onMounted(async () => {
  postTab.value = await getAllPosts() ?? [];
});

const getPercentage = (nbClic1: number, nbClic2: number) => {
  const total = nbClic1 + nbClic2;
  if (total === 0) {
    return '50%';
  }
  return `${Math.round((nbClic1 / total) * 100)}%`;
};



</script>

<template>
  <main v-if="postTab.length !== 0">
    <button :class="{hide: !(img1IsActive || img2IsActive) }" class="button-next" @click="nextPost()">Next</button>
    <button class="img-container fisrt-img">
      <img @click="setImg1()" :class="{ active: img1IsActive, no_colors: img2IsActive }" :src="postTab[tabPosition].img_url1"
        alt="">
      <h2 v-if="img1IsActive || img2IsActive">{{getPercentage(postTab[tabPosition].nb_clic1, postTab[tabPosition].nb_clic2)}}</h2>
      <h3>{{ postTab[tabPosition].prompt1}}</h3>
    </button>
    <div class="divide-bar"></div>
    <button class="img-container second-img">
      <img @click="setImg2()" :class="{ active: img2IsActive, no_colors: img1IsActive }" :src="postTab[tabPosition].img_url2"
        alt="">
      <h2 v-if="img1IsActive || img2IsActive" class="bot">{{ getPercentage(postTab[tabPosition].nb_clic2, postTab[tabPosition].nb_clic1) }}</h2>
      <h3 class="bot">{{ postTab[tabPosition].prompt2 }}</h3>
    </button>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(180deg, #EC1414 0%, #7D50DD 100%);
  overflow: hidden;
  font-family: "Anton", sans-serif;
  font-weight: 400;
  font-style: normal;

  .button-next {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background-color: #B63176;
    width: 80px;
    height: 100px;
    border: none;
    z-index: 1000;
    border-radius: 100px 0 0 100px;
    padding-left: 5px;
    font-size: 25px;
    color: #fff;
    transition: transform 0.9s ease-in-out;

    &.hide {
      transition: transform 0.9s ease-in-out;
      z-index: -1;
    }

  }

  .divide-bar {
    position: absolute;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 32px;
    width: 100vw;
    background-image: url('../assets/dividebar.svg');
  }

  .img-container {
    width: 100%;
    height: 100%;
    overflow: hidden;

    &.fisrt-img {
      border-radius: 12px 12px 0 0;
    }

    &.second-img {
      border-radius: 0 0 12px 12px;
    }

    img {
      width: 100%;
      height: 100%;
      flex-grow: 0.5;
      object-fit: cover;
      transition: transform 0.5s ease-in-out;

      &.active {
        transform: scale(1.3);
      }
      &.no_colors {
        filter: grayscale(100%);
      }
    }

    h2 {
      position: absolute;
      z-index: 999;
      top: 20%;
      left: 50%;
      transform: translate(-50%, 0);
      color: #fff;
      font-size: 50px;
      text-shadow: -3px 3px #000000;


      &.bot {
        top: 70%;
      }
    }

    h3 {
      position: absolute;
      z-index: 999;
      bottom: calc(50% + 40px);
      left: 50%;
      transform: translate(-50%, 0);
      color: #fff;
      font-size: 40px;
      text-shadow: -3px 3px #000000;

      &.bot {
        bottom: 40px;
      }
    }

  }
}
</style>
