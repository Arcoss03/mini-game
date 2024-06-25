<script setup lang="ts">
import type { Post } from '@/interfaces/post';
import { onMounted, ref, type Ref } from 'vue';
import apiHelper from '../helpers/apiHelper'
import { useUtilsStore } from '@/stores/utilsStore';
import { useUserStore } from '@/stores/userStore';

const showToast = useUtilsStore().showToast;
const utilsStore = useUtilsStore();
let img1IsActive = ref(false);
let img2IsActive = ref(false);
let postTab: Ref<Post[]> = ref([]);
let tabPosition: Ref<number> = ref(0);
const isNavOpen = useUtilsStore().isNavbarOpen;

const currentUser = useUserStore().currentUser;

onMounted(async () => {
  postTab.value = await getAllPosts() ?? [];
});

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
const getPercentage = (nbClic1: number, nbClic2: number) => {
  const total = nbClic1 + nbClic2;
  if (total === 0) {
    return '50%';
  }
  return `${Math.round((nbClic1 / total) * 100)}%`;
};

const isVoteMajority = (selectedClick: number) => {
  if (selectedClick === 1) {
    return postTab.value[tabPosition.value].nb_clic1 > postTab.value[tabPosition.value].nb_clic2;
  } else {
    return postTab.value[tabPosition.value].nb_clic2 > postTab.value[tabPosition.value].nb_clic1;
  }
};

const vote = async (id: number, selectedClick: number) => {
  const res = await apiHelper.kyPutWithoutToken(`tpf/vote/${id}`, {
    "selectedClick": selectedClick,
    "userId": currentUser?.id,
    "voteMajority": isVoteMajority(selectedClick)
  });
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

const getCenterBtnTxt = () => {
  if (img1IsActive.value || img2IsActive.value) {
    return 'Next';
  }
  return 'OU';
};

</script>

<template>
  <main v-if="postTab.length !== 0">
    <button :class="{ hide: !(img1IsActive || img2IsActive), navopen: isNavOpen()}" class="button-next"
      @click="nextPost()">{{ getCenterBtnTxt() }}
    </button>

    <div class="container first">
      <button class="img-container fisrt-img">
        <img @click="setImg1()" :class="{ active: img1IsActive, no_colors: img2IsActive }"
          :src="postTab[tabPosition].img_url1" alt="">
      </button>
      <h2 :class="{ navopen: isNavOpen() }" class="first" v-if="img1IsActive || img2IsActive">{{ getPercentage(postTab[tabPosition].nb_clic1,
        postTab[tabPosition].nb_clic2) }}</h2>
      <h3 :class="{ navopen: isNavOpen() }" class="first">{{ postTab[tabPosition].prompt1 }}</h3>
    </div>
    <div :class="{ navopen: isNavOpen() }" class="divide-bar"></div>
    <div class="container second">
      <button class="img-container second-img">
        <img @click="setImg2()" :class="{ active: img2IsActive, no_colors: img1IsActive }"
          :src="postTab[tabPosition].img_url2" alt="">
      </button>
      <h2 :class="{ navopen: isNavOpen() }" class="second" v-if="img1IsActive || img2IsActive">{{ getPercentage(postTab[tabPosition].nb_clic2,
        postTab[tabPosition].nb_clic1) }}</h2>
      <h3 :class="{ navopen: isNavOpen() }" class="second">{{ postTab[tabPosition].prompt2 }}</h3>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;
  padding-bottom: 90px;

  .container {
    width: 100%;
    height: calc(50vh - 45px);
    overflow: hidden;
    padding: 0 1rem;

    &.first {
      background-color: #EC1414;
      padding-top: 1rem;
    }

    &.second {
      background-color: #7938CB;
      padding-bottom: 1rem;
    }

    
    button {
      width: 100%;
      height: 100%;
      background-color: transparent;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 0.5s;

        &.active {
          filter: grayscale(0);
          //zoom de l'image
          transform: scale(1.2);
        }

        &.no_colors {
          filter: grayscale(100%);
        }
      }
    }

    //media query pour desktop
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    padding-bottom: 0;

    .container {
      width: 50%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      &.first, &.second {
        padding-top: 0;
        padding-bottom: 0;
      }

      &.img-container {
        border: 10px solid #17141D;
        border-radius: 12px;
      }

      button {
        width: 50vh;
        height: 50vh;
        border: 10px solid #17141D;
        border-radius: 12px;
        overflow: hidden;


      }
    }
  }
}

.button-next {
  position: absolute;
  right: 50%;
  top: calc(50% - 45px);
  transform: translate(50%, -50%);
  z-index: 10;
  background-color: #17141D;
  border: 3px solid #FFF;
  color: #FFF;
  font-size: 2rem;
  width: 5rem;
  height: 5rem;
  margin-top: -5px;
  border-radius: 9999px;

  @media (min-width: 1024px) {
    width: 6rem;
    height: 6rem;
    top: 50%;

    &.navopen {
      left: calc(50% - 43px);
    }

  }
}

.divide-bar {
  position: absolute;
  z-index: 9;
  top: calc(50% - 45px);
  right: 50%;
  transform: translate(50%, -50%);
  width: 100%;
  height: 4.8rem;
  background-image: url('../assets/dividebar.svg');
  background-position: center;

  @media (min-width: 1024px) {
    width: 9rem;
    background-image: url('../assets/dividebarV.svg');
    background-repeat: no-repeat;
    height: 100%;
    top: calc(50%);

    &.navopen {
      margin-right: -54px;
    }
  }
}

h2 {
  color: #FFF;
  font-size: 5rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px #000;
  z-index: 10;

  &.first {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);

    @media (min-width: 1024px) {
      top: 50%;
      left: 25%;
      transform: translate(-50%, -50%);

      &.navopen {
        left: calc(25% + 80px);
      }
    }


  }

  &.second {
    position: absolute;
    top: calc(75% - 45px);
    left: 50%;
    transform: translate(-50%, -50%);

    @media (min-width: 1024px) {
      top: 50%;
      left: 75%;
      transform: translate(-50%, -50%);

      &.navopen {
        left: calc(75% + 53px);
      }
    }
  }


}

h3 {
  width: 50%;
  text-align: center;
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px #000;
  font-weight: 600;

  &.first {
    position: absolute;
    top: 37%;
    left: 50%;
    transform: translate(-50%, -50%);

    @media (min-width: 1024px) {
      top: auto;
      left: 25%;
      bottom: 1rem;
      font-size: 2rem;

      &.navopen {
        width: calc(50% - 107px);
        margin-left: 54px;
      }
    }
  }

  &.second {
    position: absolute;
    bottom: 96px;
    left: 50%;
    transform: translate(-50%, -50%);

    @media (min-width: 1024px) {
      top: auto;
      left: 75%;
      font-size: 2rem;
      bottom: 1rem;

      &.navopen {
        width: calc(50% - 107px);
        margin-left: 41px;
      }
    }
  }
}
</style>
