<script setup lang="ts">
import { defineProps } from 'vue'

interface Badge {
    id: number,
    name: string
}

const props = defineProps({
    badges: Array as () => Badge[],
    addBadgeToLayout: Function,
    isVisible: Boolean,
    closePopup: Function
})
</script>

<template>
    <div class="badge-popup" @click.self="closePopup!" :class="{ visible: isVisible }">
        <div class="badge-list" v-for="badge in badges" :key="badge.id" @click.stop="addBadgeToLayout!(badge)">
            {{ badge.name }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.badge-popup {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 0.3s, opacity 0.3s linear;

    &.visible {
        visibility: visible;
        opacity: 1;
        transition-delay: 0s;
    }

    .badge-list {
        background: white;
        padding: 20px;
        border-radius: 10px;
    }
}
</style>