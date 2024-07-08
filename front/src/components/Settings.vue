<script setup lang="ts">

import { useUtilsStore } from '@/stores/utilsStore';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref, type Ref } from 'vue';
import router from '@/router';
import { on } from 'events';

const profil_picture = useUserStore().currentUser?.profil_picture;
const name = useUserStore().currentUser?.pseudo;
const userStore = useUserStore();
const isLogedIn: Ref<boolean> = ref(false);

const utilsStore = useUtilsStore();

onMounted(() => {
    isLogedIn.value = userStore.isLogedIn;
});

const onThemeChange = (event: Event) => {
    const target = (event.target as HTMLSelectElement); // Utilisation de 'as' pour le cast
    const selectedTheme = target.value; // Accès sécurisé à `value`
    utilsStore.toggleTheme(); // Supposons que cela change le thème basé sur `selectedTheme`

    console.log(selectedTheme);
};
const logout = () => {
    localStorage.removeItem('token');
    userStore.currentUser = undefined;
    router.push('/login');

};

</script>

<template>
    <main class="settings">
        <h1>Paramètres</h1>
        
        <RouterLink v-if="profil_picture !== ''" class="profil" id="log" to="/profil">
            <img class="pp" :src="profil_picture" alt="">
            <div>{{ name }}</div>
        </RouterLink>

        <div class="content">

            <label for="theme">Theme</label>
            <select name="theme" class="theme" @change="onThemeChange">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
            </select>

            <div v-if="isLogedIn">
                <h2>Mon score CO2</h2>
                <p>En moyenne, générer 1000 images coûtera entre 290 et 950 charges de smartphone : soit environ un chargement complet d'un smartphone par image, pour le modèle le plus gourmand.</p>
                <p>C'est pourquoi chez IA-game nous accordons de l'importance à l'utilisation de l'IA</p>
                <br>
                <p>Si on reprend notre image du smartphone, pour mesurer son impact carbone il faut multiplier 0,01kWh (le consommation d’électricité pour le charger) par le taux de CO2 émis par kWh dans la région. Si on charge ton iPhone 14 par exemple dans l’Oregon chez Amazon, eh bien cela génère : 2,9 grammes de CO2.</p> 
                <br>
                <p>Source : Sasha Luccioni, Génération IA</p>
    
                <button @click="logout" class="logout">Se déconnecter</button>
            </div>

        </div>
    </main>
</template>

<style scoped lang="scss">
main {
    //les classes pour le mobile
    min-height: 100vh;
    background-color: var(--bg-color);
    color: var(--color-text);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-weight: 400;
    font-style: normal;
    margin-left: 1.5rem;

    h1 {
        font-size: 2rem;
        margin-top: 20px;
        margin-left: 20px;
    }

    .profil {
        display: flex;
        align-items: center;
        margin-top: 1rem;
        gap: 1rem;

        img {
            width: 50px;
            height: 50px;
            border-radius: 999px;
        }

        div {
            font-size: 2rem;
        }
    }

    li {
        margin-top: 20px;
        list-style: none;
        display: flex;
        flex-direction: column;
    }

    a {
        color: inherit;
        text-decoration: none;
        margin-bottom: 20px;
    }

    .theme {
        width: 100px;
        height: 30px;
        border-radius: 5px;
        background-color: var(--bg-color);
        color: var(--color-text);
        border: 1px solid white;
        margin-bottom: 20px;
    }

    //les classes pour le desktop
    @media (min-width: 1024px) {
        display: flex;
        flex-direction: column;
        justify-content: start;
        color: var(--color-text);

        .profil {
            display: none;
        }

        li {
            list-style: none;
            display: flex;
            flex-direction: column;
        }
        .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-top: 20px;
            color: var(--color-text);
            max-width: 50%;
            h2 {
                font-size: 1.5rem;
                margin-bottom: 20px;
                margin-top: 20px;
            }
            .logout {
                display: flex;
                color: var(--color-text);
                margin-top: 100px;
                background-color: var(--bg-color);
                border: 1px solid white;
                border-radius: 5px;
                padding: 10px;
                cursor: pointer;
                transition: 0.3s;
                &:hover {
                    background-color: white;
                    color: var(--bg-color);
                }
            }
        }

    }
}
</style>
