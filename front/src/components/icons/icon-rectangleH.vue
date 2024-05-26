<script setup lang="ts">
const props = defineProps<{
    color: string
}>()
</script>

<template>
    <svg width="28" height="17" viewBox="0 0 28 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.895431 0 0 0.89543 0 2V15C0 16.1046 0.895431 17 2 17H26C27.1046 17 28 16.1046 28 15V2C28 0.895431 27.1046 0 26 0H2ZM24 3H4C3.44772 3 3 3.44772 3 4V13C3 13.5523 3.44772 14 4 14H24C24.5523 14 25 13.5523 25 13V4C25 3.44772 24.5523 3 24 3Z" :fill="color"/>
</svg>

</template>