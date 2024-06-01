<script setup lang="ts">
const props = defineProps<{
    color: string
}>()
</script>

<template>
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4 21V12.775L0.75 7.5L5.375 0H14.625L13.5 2H6.5L3.1 7.5L6.5 13H13.5L16.9 7.5H19.25L16 12.775V21L10 19L4 21ZM10 16.9L6 18.225V15H14V18.225L10 16.9Z" :fill="color"/>
<path d="M17 6V4H15V2H17V0H19V2H21V4H19V6H17Z" :fill="color"/>
<path d="M10 3L10.96 5.94734H14L11.52 7.79998L12.48 11L10 9.02104L7.52 11L8.48 7.79998L6 5.94734H9.04L10 3Z" :fill="color"/>
</svg>

</template>