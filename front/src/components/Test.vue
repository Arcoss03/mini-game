<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { GridLayout, GridItem } from 'grid-layout-plus'

// Define the layout with images
let layout = reactive([
{ x: 0, y: 0, w: 1, h: 1, i: '0', img: 'https://cdn2.thecatapi.com/images/8lc.png', static: false },
  { x: 1, y: 0, w: 1, h: 1, i: '1', img: 'https://cdn2.thecatapi.com/images/8lc.png', static: false },
  { x: 2, y: 0, w: 1, h: 1, i: '2', img: 'https://cdn2.thecatapi.com/images/8lc.png', static: false },
  { x: 3, y: 0, w: 1, h: 1, i: '3', img: 'https://cdn2.thecatapi.com/images/8lc.png', static: false },
])

const eventLogs = reactive<string[]>([])

const eventsDiv = ref<HTMLElement>()

const colNum = ref(4); // Nombre initial de colonnes

const updateColNum = () => {
  const width = window.innerWidth
  colNum.value = width > 1500 ? 4 : 2
}

onMounted(() => {
  updateColNum()
  window.addEventListener('resize', updateColNum)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateColNum)
})

const changeCardDimentions = (id: string, w: number, h: number) => {
  const item = layout.find((item) => item.i === id)
  if (item) {
    item.w = w
    item.h = h
    resolveCollisions()
  }
}

const deleteCard = (id: string) => {
  layout.splice(layout.findIndex((item) => item.i === id), 1);
  resolveCollisions()
}

const resolveCollisions = () => {
  layout.forEach((item, index) => {
    for (let i = index + 1; i < layout.length; i++) {
      const other = layout[i]
      if (
        item.x < other.x + other.w &&
        item.x + item.w > other.x &&
        item.y < other.y + other.h &&
        item.y + item.h > other.y
      ) {
        // Collision detected, move the other item down
        other.y = item.y + item.h
      }
    }
  })
}

const rearrangeLayout = () => {
  let nextX = 0;
  let nextY = 0;
  const newLayout: { x: number; y: number; w: number; h: number; i: string; img: string; static: boolean; }[] = [];

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



watch(
  () => eventLogs.length,
  () => {
    requestAnimationFrame(() => {
      if (eventsDiv.value) {
        eventsDiv.value.scrollTop = eventsDiv.value.scrollHeight
      }
    })
  }
)

const visiblePopup = ref<string | null>(null)

const showPopup = (id: string) => {
  visiblePopup.value = id
}

const hidePopup = (id: string) => {
  if (visiblePopup.value === id) {
    visiblePopup.value = null
  }
}
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
      <GridLayout v-model:layout="layout" :col-num="colNum" :row-height="200" :vertical-compact="true" :auto-size="true" :margin="[20, 20]" :responsive="false" :is-resizable="false">
        <GridItem v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i"
          @mouseenter="showPopup(item.i)" @mouseleave="hidePopup(item.i)">
          <span class="text">{{ item.i }}</span>
          <img class="img" :src="item.img" alt="">
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
  <button class="add-popup">
    +
  </button>
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
  color: white;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 1px;
  padding-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6a1f8a;
  }

}

.vgl-layout {
  background: transparent;
  --vgl-placeholder-bg: #7D50DD;
  width: 100%;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 3px solid black;
  border-radius: 12px;

  img {
    border-radius: 8px;
  }
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: rgb(50, 50, 142);
}

.container {
  display: flex;
  width: 100%;
  padding: 20px 100px;
  justify-content: space-between;
  height: 100vw;

  .user {
    max-width: 300px;

    .pp {
      width: 190px;
      height: 190px;
      border-radius: 9999px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    h1 {
      font-size: 40px;
      font-weight: 700;
      color: white;
    }

    p {
      word-break: break-all;
    }
  }

  .grid-container {
    width: 1000px;
    height: 100%;
  }
}

.GridItem {
  position: relative;
}

.popup {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #7d50dda8;
  padding: 12px;
  border-radius: 5px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  transform: translateY(30px); // Décale la popup vers le bas de 10px pour créer un espace
  margin: 0 20px;



  button {
    color: white;
    flex-grow: 1;
    
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
