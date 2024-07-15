<script setup lang="ts">
import { defineProps, onMounted } from 'vue'
import type { BadgeTypes } from '@/interfaces/badges';
import { on } from 'events';

const props = defineProps({
    badges: Array as () => BadgeTypes[],
    addBadgeToLayout: Function,
    isVisible: Boolean,
    closePopup: Function
})

function addbadge(badge: BadgeTypes) {
    if (badge.inLayout) {
        return
    }
    props.addBadgeToLayout!(badge.id)
    props.closePopup!()
}

</script>

<template>
    <div class="badge-popup" @click.self="closePopup!">
        <div class="badge-container">
            <div class="badge-list" :class="{isUsed: badge.inLayout}" v-for="badge in badges" :key="badge.id" @click.stop="addbadge(badge)">
                {{ badge.name }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.badge-popup {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    
    .badge-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        gap: 20px;
        background-color: var(--bg-color);
        border-radius: 12px;
        max-height: 50%;
        max-width: 50%;
        padding: 4rem;

        .badge-list {
            padding: 0 1rem;
            border-radius: 10px;
            border-right: var(--violet) 5px solid;
            border-bottom: var(--violet) 5px solid;
            max-height: 3rem;
            text-align: center;
            font-size: 1.5rem;
            background-color: var(--violet);

            &.isUsed {
                background-color: #0000003b;
                border-right: #393939 5px solid;
                border-bottom: #393939 5px solid;
            }

            &:hover {
                cursor: pointer;
                background-color: #0000003b;
            }
        }
    }
    
}
</style>