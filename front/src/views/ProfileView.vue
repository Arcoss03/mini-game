
<script setup lang="ts">
import PrivateProfil from '@/components/PrivateProfil.vue';

const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
}
</script>

<template>
     <PrivateProfil />
    <button @click="logout">logout :(</button>
</template>

<style scoped lang="scss">
button {
    background-color: #17141D;
    color: white;
    border: none;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
}
</style>