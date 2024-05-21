
<script setup lang="ts">
const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
}
</script>
<template>
    <h2>
        hello you got a token !!!! noice :)
    </h2>
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