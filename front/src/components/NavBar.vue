
<script setup lang="ts">
import { useUtilsStore } from '@/stores/utilsStore';
import { useUserStore } from '@/stores/userStore';
import hideNavBar from '@/components/icons/icon-hide-bar.vue'
import { onMounted, ref } from 'vue';

const toggleNav = useUtilsStore().toogleNavBar;
const isNavOpen = useUtilsStore().isNavbarOpen;

//define props:

const props = defineProps<{
    profil_picture: string;
}>()


</script>

<template>
    <button @click="toggleNav()" class="toogleNav" :class="{navClose: !isNavOpen()}">
        <hideNavBar />
    </button>
    
    <div class="navbar" :class="{navClose: !isNavOpen()}">
        <RouterLink class="Rte logo" to="/"><img src="../assets/logoMG.svg" alt=""></RouterLink>

        <RouterLink class="Rte" to="/tpf"><img class="img" src="../assets/TPF.svg" alt="">Tu Preferes</RouterLink>

        <RouterLink class="Rte" to="/create/tpf"><img class="img" src="../assets/AddIcon.svg" alt="">Ajouter</RouterLink>

        <RouterLink class="Rte" to="/settings"><img class="img" src="../assets/set.svg" alt="">Paramètres</RouterLink>

        <RouterLink v-if="profil_picture === ''" class="Rte" id="log" to="/login"><img src="../assets/login_24dp_FILL0_wght400_GRAD0_opsz24.svg" alt="">Se Connecter</RouterLink>
        <RouterLink v-if="profil_picture !== ''" class="Rte" id="log" to="/profil"><img class="pp" :src="profil_picture" alt="">Profil</RouterLink>

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
    background-color: var(--bg-color-elements);
    padding: 10px;
    width: 100vw;
    z-index: 999;


    .logo {
        display: none;
        img {
            display: none;
        }
    }

    a {
        color: white;
        text-decoration: none;
        margin: 10px;
    }

    .log {
        bottom: 0;
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

    .pp {
        width: 40px;
        height: 40px;
        border-radius: 999px;
    }

    .hide {
        color: red;
    }

    //les classes pour le desktop
    @media (min-width: 1024px) {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 110px;
        height: 100vh;

        &.navClose {
            display: none;
            width: 0;
        }

        .logo {
            display: block;
            img {
                display: block;
                width: 100px;
                height: 100px;
            }
            margin: 2rem 0 1rem;
        }
        #log {
            position: fixed;
            bottom: 0;
        }
        a {
            margin: 10px 0;
        }
    }

}
.toogleNav {
        display: none;
        
    }

@media (min-width: 1024px) {
    .toogleNav {
            display: block;
            position: absolute;
            top: 0.5rem;
            left: 5rem;
            fill: #fff;
            z-index: 1000;

            &.navClose {
                left: 1rem;
                transform: scaleX(-1);
            }

        }
}

* {
    list-style: none;
}

</style>
