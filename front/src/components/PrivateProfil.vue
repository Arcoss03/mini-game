<script setup lang="ts">
import { ref, reactive, watch, onMounted, type Ref } from 'vue';
import { GridLayout, GridItem, type Layout } from 'grid-layout-plus';
import type { LayoutProfil } from '@/interfaces/profil';
import { useUserStore } from '@/stores/userStore';
import type { UserDetails } from '@/interfaces/user';
import { useUtilsStore } from '@/stores/utilsStore';
import iconRectangleH from './icons/icon-rectangleH.vue';
import iconRectangleV from './icons/icon-rectangleV.vue';
import iconBigSquare from './icons/icon-bigSquare.vue';
import iconMiniSquare from './icons/icons-miniSquare.vue';
import iconChange from './icons/icon-change.vue';
import { v4 as uuidv4 } from 'uuid';
import iconTrash from './icons/icon-trash.vue';
import apiHelper from '@/helpers/apiHelper';
import iconAddImg from './icons/icon-add-img.vue';
import iconAddText from './icons/icon-add-text.vue';
import iconAddBadge from './icons/icon-add-badge.vue';
import BadgesPopupList from './popups/BadgesPopupList.vue';
import type { BadgeTypes } from '@/interfaces/badges';
import badgeItem  from '@/components/BadgeItem.vue';

const showToast = useUtilsStore().showToast;
const userStore = useUserStore();
let user: Ref<UserDetails | null> = ref(null);

let layout = reactive<LayoutProfil[]>([]);

const layoutIsInitialized = ref(false);

const eventLogs = reactive<string[]>([]);

const eventsDiv = ref<HTMLElement>();

const colNum = ref(4); // Nombre initial de colonnes

const badges:Ref<BadgeTypes[]> = ref([]);

const badgePopupVisible = ref(false);


onMounted(async () => {
  window.addEventListener('resize', updateColNum);
  user.value = await userStore.getUserDetailsById(useUserStore().currentUser?.id);
  layout.push(...user.value?.profil.layout || []);
  updateColNum();
  //pour eviter que le watch du layout s'active a l'init (oui c'es moche :( )
  badges.value = await getBadgesTypesList();
  setTimeout(() => {
    eventLogs.push('Layout is initialized');
    layoutIsInitialized.value = true;
  }, 1000);
});

const toggleBadgePopup = () => {
  badgePopupVisible.value = !badgePopupVisible.value;
};

const getNextId = () => {
  // Trouvez l'ID le plus élevé parmi les cartes existantes
  const maxId = layout.length > 0 ? Math.max(...layout.map(card => Number(card.i))) : 0;

  // Utilisez maxId + 1 pour l'ID de la nouvelle carte
  return (maxId + 1).toString();
};

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const debounce = (func: Function, delay: number) => {
  return (...args: any[]) => {
    if (debounceTimeout !== null) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const updateColNum = () => {
  const width = window.innerWidth;
  colNum.value = width > 1250 ? 4 : 2;
};

const changeProfilPicture = () => {
  user.value!.profil_picture = "https://api.dicebear.com/8.x/bottts-neutral/svg?seed=" + uuidv4();
};

const changeCardDimentions = (id: string, w: number, h: number) => {
  const item = layout.find((item) => item.i === id);
  if (item) {
    item.w = w;
    item.h = h;
    resolveCollisions();
  }
};

const deleteCard = (id: string) => {
  layout.splice(layout.findIndex((item) => item.i === id), 1);
  resolveCollisions();
  badges.value = isBadgeInLayout(badges.value);
};

const resolveCollisions = () => {
  layout.forEach((item, index) => {
    for (let i = index + 1; i < layout.length; i++) {
      const other = layout[i];
      if (
        item.x < other.x + other.w &&
        item.x + item.w > other.x &&
        item.y < other.y + other.h &&
        item.y + item.h > other.y
      ) {
        // Collision detected, move the other item down
        other.y = item.y + item.h;
      }
    }
  });
};

const rearrangeLayout = () => {
  let nextX = 0;
  let nextY = 0;
  const newLayout: LayoutProfil[] = [];

  // Triez les éléments par leur position Y, puis X pour conserver un ordre de haut en bas et de gauche à droite
  const sortedLayout = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);

  sortedLayout.forEach(item => {
    if (nextX + item.w > colNum.value) { // Si l'élément suivant ne rentre pas dans la ligne, passez à la ligne suivante
      nextX = 0;
      nextY++;
    }

    newLayout.push({ ...item, x: nextX, y: nextY }); // Ajoutez l'élément avec la nouvelle position
    nextX += item.w;
  });

  layout.splice(0, layout.length, ...newLayout); // Remplacez l'ancien layout par le nouveau
};

const updateUserProfileDebounced = debounce(async () => {
  if (user.value) {
    user.value.profil.layout = layout;

    const res = await userStore.updateUserProfile(user.value, localStorage.getItem('token') || '');
    if (res) {
      showToast('Profile updated', true);
    } else {
      showToast('Profile update failed', false);
    }
  }
}, 3000);

// Watchers pour les changements de colonnes et de layout --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
watch(colNum, () => {
  rearrangeLayout();
}, { immediate: true });

watch(layout, () => {
  if (!layoutIsInitialized.value) {
    return;
  }
  updateUserProfileDebounced();
});

watch(() => [user.value?.profil_picture, user.value?.pseudo, user.value?.description], () => {
  if (!layoutIsInitialized.value) {
    return;
  }
  updateUserProfileDebounced();
});

watch(
  () => eventLogs.length,
  () => {
    requestAnimationFrame(() => {
      if (eventsDiv.value) {
        eventsDiv.value.scrollTop = eventsDiv.value.scrollHeight;
      }
    });
  }
);

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const visiblePopup = ref<string | null>(null);

const showPopup = (id: string) => {
  visiblePopup.value = id;
};

const hidePopup = (id: string) => {
  if (visiblePopup.value === id) {
    visiblePopup.value = null;
  }
};

const newCardText = () => {
  layout.push({
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    i: getNextId(),
    static: false,
    text: '',
    type: 'text',
  });
};

const newCardImg = async () => {
  // provisoire !!
  //appel a cat api pour recuperer une image
  const catImg = await apiHelper.getCat();
  if (catImg === '') {
    showToast('Failed to get cat image', false);
    return;
  }

  layout.push({
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    i: getNextId(),
    static: false,
    img: catImg,
    type: 'img',
  });
};

const setNewCardBadge = (type_badge_id: number) => {
  layout.push({
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    i: getNextId(),
    static: false,
    type: 'badge',
    type_badge_id: type_badge_id,
  });
  badges.value = isBadgeInLayout(badges.value);
};

const getBadgesTypesList = async() => {
  const res = await apiHelper.kyGet('badges/types');
  const badges = res.data as unknown as BadgeTypes[];
  //ajouter un boolen pour savoir si le badge est deja dans le layout
  badges.forEach(badge => {
    badge.inLayout = layout.some(item => item.type_badge_id === badge.id);
  });
  return badges;
};

const isBadgeInLayout = (badges: BadgeTypes[]) => {
  badges.forEach(badge => {
    badge.inLayout = layout.some(item => item.type_badge_id === badge.id);
  });
  return badges;
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
</script>
<template>
  <div class="container">
    <div class="user" v-if="user">
      <div class="pp">
        <img :src="user.profil_picture" alt="avatar">
        <button @click="changeProfilPicture" class="btn-pp"><iconChange color="white"/></button>
      </div>
      <input v-model="user.pseudo" type="text">
      <textarea class="descrition" name="description" v-model="user.description"  id="description" placeholder="description"></textarea>
    </div>

    <div class="grid-container">
      <GridLayout class="grid" v-model:layout="layout" :col-num="colNum" :row-height="178" :vertical-compact="true" :auto-size="true"
        :margin="[20, 20]" :is-resizable="false">
        <GridItem v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i"
          @mouseenter="showPopup(item.i)" @mouseleave="hidePopup(item.i)">
          <img v-if="item.img" class="img" :src="item.img" alt="">
          <textarea type="text" placeholder="Type text ..." v-if="item.text !== undefined"
            v-model="item.text">
          </textarea>
          <badgeItem v-if="item.type === 'badge'" :type_badge_id="item.type_badge_id!" :user_id="user!.id!" class="badge-item"/>
          <div class="badge">

          </div>
          <div class="item-popup" :class="{ badge: item.type === 'badge' }" v-show="visiblePopup === item.i">
            <button @click="changeCardDimentions(item.i, 1, 1)">
              <iconMiniSquare class="icon mini" color="white" />
            </button>
            <button @click="changeCardDimentions(item.i, 2, 1)">
              <iconRectangleH class="icon" color="white" />
            </button>
            <button @click="changeCardDimentions(item.i, 1, 2)">
              <iconRectangleV class="icon" color="white" />
            </button>
            <button @click="changeCardDimentions(item.i, 2, 2)">
              <iconBigSquare class="icon" color="white" />
            </button>
            <button class="trash" @click="deleteCard(item.i)">
              <iconTrash class="icon mini" color="white" />
            </button>
          </div>
        </GridItem>
      </GridLayout>
    </div>
  </div>
  <BadgesPopupList v-if="badgePopupVisible" :badges="badges" :addBadgeToLayout="setNewCardBadge" :isVisible="badgePopupVisible" :closePopup="toggleBadgePopup" />
  <div class="add-popup">
    <div class="plus-sign">+</div>
    <button @click="newCardText" class="extra-btn">
      <iconAddText class="icon" color="white" />
    </button>
    <button @click="newCardImg" class="extra-btn">
      <iconAddImg class="icon" color="white" />
    </button>
    <button class="extra-btn">
      <iconAddBadge @click="toggleBadgePopup()" class="icon" color="white" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.add-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 9999px;
  background-color: #7D50DD;
  color: #fff;
  font-size: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s, width 0.3s;

  .plus-sign {
    transition: opacity 0.3s;
    padding: 1px 0 6px 0;
  }

  .extra-btn {
    display: none;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0;
    color: #fff;

    .icon {
      width: 24px;
      height: 24px;
    
    }

  }

  &:hover {
    background-color: #6a1f8a;
    width: 200px; // Agrandir le bouton
    justify-content: space-between; // Pour séparer les boutons correctement
    padding: 0 20px; // Ajouter un padding pour le confort visuel

    .plus-sign {
      display: none;
    }

    .extra-btn {
      display: flex; // Afficher les boutons supplémentaires
    }


  }
}



.vgl-layout {
  background: transparent;
  --vgl-placeholder-bg: #7D50DD;
  width: 100%;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border-radius: 12px;
  position: relative;
  z-index: 4;

  img {
    border-radius: 8px;
  }
  .badge-item {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    padding: 0;
  }

  textarea {
    width: 100%;
    height: 100%;
    font-size: 20px;
    align-items: center;
    overflow: auto;
    resize: none;
    border-radius: 8px;
    background-color: #17141D;
    color: white;
    padding: 10px;
    outline: none;
    /* enlève l'outline */
    border: none;
    /* enlève le border */
    text-align: center;
    align-content: center;
    cursor: move;


    &:focus {
      outline: none;
      background-color: #1b1820;
    }
  }
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: rgb(50, 50, 142);
}

.container {
  width: 100%;
  padding: 20px 0px;
  justify-content: space-around;
  height: 100vh;
  
  .user {
    display: flex;
    flex-direction: column;

    .pp {
      overflow: hidden;
      margin: 20px 0;

      img {
        width: 190px;
        height: 190px;
        object-fit: cover;
        border-radius: 999px;
      }
      .btn-pp {
        background: #7D50DD;
        position: absolute;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        margin-left: 140px;
        margin-top: -40px;

        &:active {
                transform: rotate(-180deg);
                transition: transform 0.2s ease-in-out;
            }
        
      }
      
    }
    input {
      font-size: 44px;
      font-weight: 700;
      color: white;
      background: transparent;
      border: none;
      outline: none;
    }
    .descrition {
      color: white;
      word-break: break-all;
      font-size: 20px;
      background: transparent;
      border: none;
      outline: none;
      resize: none;
      padding: 10px;
      height: 225px;
    
    }



  }

  .grid-container {
    display: flex;
    justify-content: center;
  }

  .grid {
    width: 380px;
    min-width: 380px;
    height: auto;
  }

  //media querie pour screen > 1278px
  @media (min-width: 1250px) {
    padding: 20px 30px 20px 50px;
    display: flex;

    .user {
      align-items: left;
      max-width: 400px;
    }

    ;

    .grid {
      width: 810px;
    }
  }

}

.GridItem {
  position: relative;
}

.item-popup {
  position: absolute;
  z-index: 999;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #7d50dda8;
  padding: 5px;
  border-radius: 5px;
  text-align: center;
  height: 2.4rem;
  display: flex;
  justify-content: space-between;
  transform: translateY(15px); // Décale la popup vers le bas de 10px pour créer un espace
  margin: 0 20px;

  button {
    color: white;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      width: 28px;
      height: 28px;

      &.mini {
        width: 17px;
        height: 17px;
        margin: 6px 0;
      }
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  &.badge {
    button {
        display: none;

        &.trash {
          display: block;
        }
      }
  }
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
}

.text {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 18px;
  color: white;
  text-shadow: 0 0 5px black;
}
</style>