
<script setup lang="ts">
import { useUtilsStore } from '@/stores/utilsStore';
import { useUserStore } from '@/stores/userStore';
import hideNavBar from '@/components/icons/icon-hide-bar.vue'
import { onMounted, ref } from 'vue';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const toggleNav = useUtilsStore().toogleNavBar;
const isNavOpen = useUtilsStore().isNavbarOpen;

const currentUrl = ref(window.location.pathname);

const route = useRoute();

// Mettre à jour currentUrl chaque fois que l'URL change
watch(route, () => {
    currentUrl.value = window.location.pathname;
});

const props = defineProps<{
    profil_picture: string;
}>()

const isInUrl = (url: string) => {
    return currentUrl.value === `/${url}`;
}



</script>

<template>
    <button @click="toggleNav()" class="toogleNav" :class="{navClose: !isNavOpen()}">
        <hideNavBar />
    </button>
    
    <div class="navbar" :class="{navClose: !isNavOpen()}">
        <RouterLink class="Rte logo" to="/"><img src="../assets/logoMG.svg" alt=""></RouterLink>

        <RouterLink :class="{active: isInUrl('tpf')}" class="Rte" to="/tpf"><img class="img" src="../assets/TPF.svg" alt="">Tu Preferes</RouterLink>

        <RouterLink :class="{active: isInUrl('create/tpf')}" class="Rte" to="/create/tpf"><img class="img" src="../assets/AddIcon.svg" alt="">Ajouter</RouterLink>

        <RouterLink :class="{active: isInUrl('settings')}" class="Rte desktop" to="/settings"><img class="img" src="../assets/set.svg" alt="">Paramètres</RouterLink>

        <RouterLink :class="{active: isInUrl('choice-gmp')}" class="Rte gmp" to="/choice-gmp"><img class="img" src="../assets/gess_my_prompt.svg" alt="">GuessMyPrompt</RouterLink>        

        <RouterLink v-if="profil_picture === ''" class="Rte" id="log" to="/login">
            <img src="../assets/login_24dp_FILL0_wght400_GRAD0_opsz24.svg" alt="">
            <div>Connexion</div>
        </RouterLink>
        <RouterLink v-if="profil_picture !== ''" class="Rte desktop profil" id="log" to="/profil"><img class="pp" :src="profil_picture" alt="">Profil</RouterLink>
        <RouterLink :class="{active: isInUrl('settings')}" v-if="profil_picture !== ''" class="Rte mobile" id="log" to="/settings"><img class="pp" :src="profil_picture" alt="">Paramètres</RouterLink>

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
    gap: 10px;

    a {
        color: var(--color-text);
        text-decoration: none;
    }

    .log {
        bottom: 0;
    }
    
    .Rte {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-grow: 1;
        flex: 1;
        padding: 10px 0;
        font-size: 13px;

        &.gmp {
            font-size: 11px;
        }

        &.active {
            background-color: rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            
        }

        &.logo {
        display: none;
        }

        &.desktop {
            display: none;
        }
    }
    .img {
        width: 20px;
        height: 20px;
    }

    .pp {
        width: 24px;
        height: 24px;
        border-radius: 999px;
    }

    //les classes pour le desktop
    @media (min-width: 1024px) {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 110px;
        height: 100vh;

        .pp {
            width: 40px;
            height: 40px;
        }

        &.navClose {
            display: none;
            width: 0;
        }

        .Rte {
            font-size: 16px;
            &.logo {
                display: flex;
                img {
                    display: block;
                    width: 100px;
                    height: 100px;
                    margin-top: 1rem;
                }
            }
            &.profil {
                width: fit-content;
            }

            &.desktop {
                display: flex;
            }

            &.mobile {
                display: none;
            }

            &.gmp {
                img {
                    margin-bottom: 3px
                }

                font-size: 13px;
            }

            flex: auto;
            flex-grow: 0;
            width: 100%;
        }

        #log {
            position: fixed;
            bottom: 0;
        }
    }

}
.toogleNav {
        display: none;
        
    }

@media (min-width: 1024px) {
    .toogleNav {
            display: block;
            position: fixed; 
            top: 0.5rem;
            left: 5rem;
            fill: var(--color-text);
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
