<script setup lang="ts">
const props = defineProps<{
    color: string;
}>()
</script>

<template>
<svg width="17" height="28" viewBox="0 0 17 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.895431 0 0 0.895431 0 2V26C0 27.1046 0.89543 28 2 28H15C16.1046 28 17 27.1046 17 26V2C17 0.895431 16.1046 0 15 0H2ZM13 3H4C3.44772 3 3 3.44772 3 4V24C3 24.5523 3.44772 25 4 25H13C13.5523 25 14 24.5523 14 24V4C14 3.44772 13.5523 3 13 3Z" :fill="color"/>
</svg>


</template>