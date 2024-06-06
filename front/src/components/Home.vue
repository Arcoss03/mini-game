
<script setup lang="ts">

import { onMounted, ref, type Ref} from 'vue';
import { useUtilsStore } from '@/stores/utilsStore';
import NavBar from './NavBar.vue';

</script>


<template>
    <main class="home">
        <NavBar />
    </main>
</template>

<style scoped lang="scss">
main {
    min-height: 100vh;
    background: #211D2A;
    border: solid #17141D;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;

    
}
</style>
