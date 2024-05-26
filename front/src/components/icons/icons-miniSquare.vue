<script setup lang="ts">
const props = defineProps<{
    color: string
}>()
</script>

<template>
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.895431 0 0 0.89543 0 2V15C0 16.1046 0.89543 17 2 17H15C16.1046 17 17 16.1046 17 15V2C17 0.895431 16.1046 0 15 0H2ZM13 3H4C3.44772 3 3 3.44772 3 4V13C3 13.5523 3.44772 14 4 14H13C13.5523 14 14 13.5523 14 13V4C14 3.44772 13.5523 3 13 3Z" :fill="color"/>
</svg>
</template>