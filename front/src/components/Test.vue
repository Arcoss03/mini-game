<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { GridLayout, GridItem, type Layout } from 'grid-layout-plus';
import type { LayoutProfile } from '@/interfaces/profile';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

// Define the layout with images
let layout = reactive<LayoutProfile[]>([]);
const layoutIsInitialized = ref(false);

const getProfile = (): Promise<LayoutProfile[]> => {
  //fake une fonction d'une api
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { x: 0, y: 0, w: 1, h: 1, i: '0', img: 'https://cdn2.thecatapi.com/images/8lc.png', static: false },
        { x: 1, y: 0, w: 1, h: 1, i: '1', img: 'https://cdn2.thecatapi.com/images/8lc.png', static: false },
        { x: 2, y: 0, w: 1, h: 1, i: '2', img: 'https://cdn2.thecatapi.com/images/8lc.png', static: false },
        { x: 3, y: 0, w: 1, h: 1, i: '3', img: 'https://cdn2.thecatapi.com/images/8lc.png', static: false },]);
    }, 1000);
  });
}

const eventLogs = reactive<string[]>([]);

const eventsDiv = ref<HTMLElement>();

const colNum = ref(4); // Nombre initial de colonnes

let debounceTimeout: number | null = null;

const updateColNum = () => {
  const width = window.innerWidth;
  colNum.value = width > 1278 ? 4 : 2;
};

onMounted(async () => {
  window.addEventListener('resize', updateColNum);
  let test = await userStore.getUserDetailsById(useUserStore().currentUser?.id);
  console.log(test);
  layout.push(...await getProfile());
  updateColNum();
  console.log(layout);

  //pour eviter que le watch du layout s'active a l'init (oui c'es moche :( )
  setTimeout(() => {
    eventLogs.push('Layout is initialized');
    layoutIsInitialized.value = true;
  }, 1000);

});

onUnmounted(() => {
  window.removeEventListener('resize', updateColNum);
});

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
  const newLayout: LayoutProfile[] = [];

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

watch(colNum, () => {
  rearrangeLayout();
}, { immediate: true });

watch(layout, () => {
  if (!layoutIsInitialized.value) {
    return;
  }
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = setTimeout(() => {
    console.log("youuuuhou", layoutIsInitialized.value);
  }, 3000);
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
    i: layout.length.toString(),
    static: false,
    text: '',
  });
};
</script>

<template>
  <div class="container">
    <div class="user">
      <div class="pp">
        <img src="https://cdn2.thecatapi.com/images/8lc.png" alt="avatar">
      </div>
      <h1>
        Belino Matio
      </h1>
      <p>
        sqdhqsdqsdisqgdsqgdujqsvdsjqdvsqddfbsdfbsdjlfbjsdlbfjdsbfjlsdbf
      </p>
    </div>

    <div class="grid-container">
      <GridLayout v-model:layout="layout" :col-num="colNum" :row-height="200" :vertical-compact="true" :auto-size="true"
        :margin="[20, 20]" :is-resizable="false">
        <GridItem v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i"
          @mouseenter="showPopup(item.i)" @mouseleave="hidePopup(item.i)">
          <img v-if="item.img" class="img" :src="item.img" alt="">
          <textarea type="text" placeholder="Type text ..." v-if="item.text !== undefined"
            v-model="item.text"></textarea>
          <div class="popup" v-show="visiblePopup === item.i">
            <button @click="changeCardDimentions(item.i, 1, 1)">A</button>
            <button @click="changeCardDimentions(item.i, 2, 1)">B</button>
            <button @click="changeCardDimentions(item.i, 1, 2)">C</button>
            <button @click="changeCardDimentions(item.i, 2, 2)">D</button>
            <button @click="deleteCard(item.i)">#</button>
          </div>
        </GridItem>
      </GridLayout>
    </div>
  </div>
  <div class="add-popup">
    <div class="plus-sign">+</div>
    <button @click="newCardText" class="extra-btn">1</button>
    <button class="extra-btn">2</button>
    <button class="extra-btn">3</button>
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
    padding: 1px 0 4px 0;
  }

  .extra-btn {
    display: none;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0;
    color: #fff;

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
  justify-content: space-between;
  height: 100vw;

  .user {
    display: flex;
    flex-direction: column;

    .pp {
      width: 190px;
      height: 190px;
      border-radius: 999px;
      overflow: hidden;
      margin: 20px 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    h1 {
      font-size: 44px;
      font-weight: 700;
      color: white;
    }

    p {
      word-break: break-all;
      font-size: 20px;
    }

  }

  .grid-container {
    width: 380px;
    min-width: 380px;
    height: 100%;
  }

  //media querie pour screen > 1278px
  @media (min-width: 1278px) {
    padding: 20px 30px 20px 50px;
    display: flex;

    .user {
      align-items: left;
      max-width: 400px;
    }

    ;

    .grid-container {
      width: 900px;
      min-width: 900px;
    }
  }

}

.GridItem {
  position: relative;
}

.popup {
  position: absolute;
  z-index: 999;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #7d50dda8;
  padding: 5px;
  border-radius: 5px;
  text-align: center;
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

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
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