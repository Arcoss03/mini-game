<script setup lang="ts">
import type { Post } from '@/interfaces/post';
import { onMounted, ref, type Ref } from 'vue';
import apiHelper from '../helpers/apiHelper'
import { useUtilsStore } from '@/stores/utilsStore';
import { useUserStore } from '@/stores/userStore';

const showToast = useUtilsStore().showToast;
let img1IsActive = ref(false);
let img2IsActive = ref(false);
let postTab: Ref<Post[]> = ref([]);
let tabPosition: Ref<number> = ref(0);

const currentUser = useUserStore().currentUser;


const setImg1 = () => {
  if (!img1IsActive.value && !img2IsActive.value && postTab.value.length !== 0) {
    img1IsActive.value = true;
    img2IsActive.value = false;
    vote(postTab.value[tabPosition.value].id!, 1);
  }
};

const setImg2 = () => {
  if (!img1IsActive.value && !img2IsActive.value) {
    img1IsActive.value = false;
    img2IsActive.value = true;

    vote(postTab.value[tabPosition.value].id!, 2);
  }
};

async function getAllPosts(): Promise<Post[] | undefined> {
  let res;
  if (currentUser?.id) {
    res = await apiHelper.kyGet(`tpf/${currentUser.id}`); 
  } else {
    res = await apiHelper.kyGet('tpf');
  }
  if (!res.success) {
    showToast('Erreur lors du chargement des tu préfères', false);
  } else {
    return res.data as unknown as Post[]
  }
}

const vote = async (id: number, selectedClick: number) => {
  const res = await apiHelper.kyPutWithoutToken(`tpf/vote/${id}`, { "selectedClick": selectedClick, "userId": currentUser?.id });
  if (!res.success) {
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
    <button :class="{ hide: !(img1IsActive || img2IsActive) }" class="button-next" @click="nextPost()">Next</button>
    <div class="container first">
      <button class="img-container fisrt-img">
        <img @click="setImg1()" :class="{ active: img1IsActive, no_colors: img2IsActive }"
          :src="postTab[tabPosition].img_url1" alt="">
      </button>
    </div>
    <h2 v-if="img1IsActive || img2IsActive">{{ getPercentage(postTab[tabPosition].nb_clic1,
      postTab[tabPosition].nb_clic2)}}</h2>
    <h3>{{ postTab[tabPosition].prompt1 }}</h3>
    <div class="divide-bar"></div>
    <div class="container second">
      <button class="img-container second-img">
        <img @click="setImg2()" :class="{ active: img2IsActive, no_colors: img1IsActive }"
          :src="postTab[tabPosition].img_url2" alt="">
      </button>
    </div>
    <h2 v-if="img1IsActive || img2IsActive" class="bot">{{ getPercentage(postTab[tabPosition].nb_clic2,
      postTab[tabPosition].nb_clic1) }}</h2>
    <h3 class="bot">{{ postTab[tabPosition].prompt2 }}</h3>
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
  overflow: hidden;
  font-family: "Anton", sans-serif;
  font-weight: 400;
  font-style: normal;

  .button-next {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background-color: #17141D;
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

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }

  .divide-bar {
    position: absolute;
    z-index: 999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 77px;
    width: 100vw;
    background-image: url('../assets/dividebar.svg');
  }

  .img-container {
    width: 100%;
    height: 100%;
    overflow: hidden;

    &.fisrt-img {
      border-top: 1rem solid #EC1414;
      border-left: 1rem solid #EC1414;
      border-right: 1rem solid #EC1414;
    }

    &.second-img {
      border-bottom: 1rem solid #7938CB;
      border-left: 1rem solid #7938CB;
      border-right: 1rem solid #7938CB;

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

  @media (min-width: 768px) {
    flex-direction: row;

    .divide-bar {
      width: 140px;
      background-image: url('../assets/dividebarV.svg');
      top: 50%;
      height: 100%;
      background-repeat: no-repeat;
    }

    .container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      height: 100%;
      width: 50%;
      width: 100%;
      height: 100%;
      padding-top: 13%;
      &.first {
        background-color: #EC1414;
      }
      &.second {
        background-color: #7938CB;
      }

    }

    .img-container {
      width: 35vw;
      height: 35vw;
      overflow: hidden;
      border-radius: 40px;

      &.fisrt-img {
        border: solid 0.5rem #211D2A;

      }

      &.second-img {
        border: solid 0.5rem #211D2A;

      }

      img {
        
        object-fit: cover;
        border-radius: 30px;
      }

      
    }
    h2 {
      //center absolute
      left: 25%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 70px;
    
      &.bot {
        left: 75%;
        top: 50%;
      }
    }
    
    h3 {
      left: 25%;
      bottom: 3rem;
    
      &.bot {
        left: 75%;
      }
    }


  }
}
</style>
