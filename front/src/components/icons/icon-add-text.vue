<script setup lang="ts">
const props = defineProps<{
    color: string
}>()
</script>

<template>
    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 11V9H10V7H12V5H14V7H16V9H14V11H12Z" :fill="color"/>
<path d="M6.875 1.45508V12.7148L8.4668 12.9883V14.2188H3.35938V12.9883L4.95117 12.7148V1.45508H1.72852L1.44531 3.42773H0V0H11.8164V3.42773H10.3906L10.0977 1.45508H6.875Z" :fill="color"/>
</svg>

</template>