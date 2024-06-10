
<script setup lang="ts">
</script>

<template>
    <div class="navbar">
        
        <RouterLink class="Rte" to="/"><img class="logo" src="../assets/logoMG.svg" alt=""></RouterLink>

        <RouterLink class="Rte" to="/tpf"><img class="img" src="../assets/TPF.svg" alt="">TuPreferes</RouterLink>

        <RouterLink class="Rte" to="/create"><img class="img" src="../assets/AddIcon.svg" alt="">Add</RouterLink>

        <RouterLink class="Rte" to="/settings"><img class="img" src="../assets/set.svg" alt="">Settings</RouterLink>

        <RouterLink class="Rte" id="log" to="/login"><img src="../assets/login_24dp_FILL0_wght400_GRAD0_opsz24.svg" alt="">Se connecter</RouterLink>

    </div>
</template>


<style scoped lang="scss">

.navbar {

    //les classes pour le mobile
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-around;
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
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 110px;
        height: 100vh;

        .logo {
            display: block;
            width: 100px;
            height: 100px;
            margin-bottom: 20px;
        }
        #log {
            position: fixed;
            bottom: 0;
        }
        a {
            margin: 10px 0;
        }
    }
    .Rte {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .img {
        width: 20px;
        height: 20px;
    }

    

}
* {
    list-style: none;
}

</style>
