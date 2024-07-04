<script setup lang="ts">

import { useUtilsStore } from '@/stores/utilsStore';
import { useUserStore } from '@/stores/userStore';

const profil_picture = useUserStore().currentUser?.profil_picture;
const name = useUserStore().currentUser?.pseudo;

const utilsStore = useUtilsStore();

const onThemeChange = (event: Event) => {
    const target = (event.target as HTMLSelectElement); // Utilisation de 'as' pour le cast
    const selectedTheme = target.value; // Accès sécurisé à `value`
    utilsStore.toggleTheme(); // Supposons que cela change le thème basé sur `selectedTheme`

    console.log(selectedTheme);
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
            <li>
                <label for="theme">Theme</label>
                <select name="theme" class="theme" @change="onThemeChange" >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                </select>
                <a href="">Mon score CO2</a>
            </li>
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
        gap:1rem;
        
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

        .profil {
            display: none;
        }

        li {
            list-style: none;
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
