
<script setup lang="ts">
</script>

<template>
    <div class="navbar">
        <a href="/"><img class="logo" src="../assets/logoMG.svg" alt=""></a>
        <a href="/tpf"><img src="../assets/TPF.svg" alt=""></a>
        <a href="/create"><img src="../assets/AddIcon.svg" alt="ADD"></a>
        <a href="/"><img src="../assets/Set.svg" alt=""></a>
        <a class="log" href="/login">Se connecter</a>
    </div>
</template>


<style scoped lang="scss">

.navbar {

    //les classes pour le mobile
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #17141D;
    padding: 10px;
    width: 100vw;


    .logo {
        display: none;
    }

    a {
        color: white;
        text-decoration: none;
        margin: 10px;
    }

    .log {
        bottom: 0;
    }
    //les classes pour le desktop
    @media (min-width: 769px) {
        flex-direction: column;
        width: 110px;
        height: 100vh;

        .logo {
            display: block;
            width: 90px;
            height: 90px;
            margin-bottom: 20px;
        }
        .log {
            position: fixed;
            bottom: 0;
        }
        a {
            margin: 10px 0;
        }
    }
    

}
</style>
