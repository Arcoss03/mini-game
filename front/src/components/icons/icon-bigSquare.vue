<script setup lang="ts">
const props = defineProps<{
    color: string
}>()
</script>

<template>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="M2 0C0.895431 0 0 0.895431 0 2V26C0 27.1046 0.895431 28 2 28H26C27.1046 28 28 27.1046 28 26V2C28 0.895431 27.1046 0 26 0H2ZM24 3H4C3.44772 3 3 3.44772 3 4V24C3 24.5523 3.44772 25 4 25H24C24.5523 25 25 24.5523 25 24V4C25 3.44772 24.5523 3 24 3Z"
            :fill="color" />
    </svg>
</template>