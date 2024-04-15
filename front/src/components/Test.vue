<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { GridLayout, GridItem } from 'grid-layout-plus'

import type { Layout } from 'grid-layout-plus'

const layout = reactive([
  { x: 3, y: 0, w: 2, h: 2, i: '0', img: 'https://cdn2.thecatapi.com/images/8lc.png', static: false },
  { x: 2, y: 0, w: 2, h: 4, i: '1', static: false },

])

const eventLogs = reactive<string[]>([])

const eventsDiv = ref<HTMLElement>()

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
</script>

<template>
  <div ref="eventsDiv" class="event-logs">
    <div v-for="(event, index) in eventLogs" :key="index">
      {{ event }}
    </div>
  </div>
  <div style="margin-top: 10px">
    <GridLayout
      v-model:layout="layout"
      :col-num="12"
      :row-height="30"
      :vertical-compact="false"

    >
      <GridItem
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"

      >
        <span class="text">{{ item.i }}</span>
        <img class="img" :src="item.img" alt="">
      </GridItem>
    </GridLayout>
  </div>
</template>

<style scoped lang="scss">
.vgl-layout {
background: transparent;
--vgl-placeholder-bg: #f0f0f0;

}


:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 3px solid black;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: rgb(50, 50, 142);
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;

}


</style>

