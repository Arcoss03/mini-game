<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { useUtilsStore } from '@/stores/utilsStore'
import { useRouter } from 'vue-router'
import Chat from './Chat.vue'

let searchTerm = ref('')
let router = useRouter()

const submitForm = () => {
    router.push(`/profil/${searchTerm.value}`)
}

const redirectTo = (path: string) => {
    router.push(path)
}

const redirectToExternal = (path: string) => {
    window.location.href = path;
}
</script>

<template>
    <main class="home">
        <div class="feed">
            <form @submit.prevent="submitForm">
                <div class="search">
                    <input type="text" name="test" v-model="searchTerm" placeholder="recherche" />
                    <button type="submit">
                        <img src="../assets/search.svg" alt="" />
                    </button>
                </div>
            </form>
            <div class="feed-container">

                <div class="article">
                    <h2 class="article-header">Tu-prefères?</h2>
                    <div class="article-content">
                        <img @click="redirectTo('/tpf')" src="../assets/tpf_exemple.png" alt="article" />
                        <p class="content">
                            Choisissez entre deux situations difficiles. Une IA (DALL·E) génère des images pour
                            illustrer chaque choix. <br> <br> Comparez ensuite vos préférences avec celles des autres
                            joueurs grâce aux pourcentages des votes.
                        </p>
                    </div>
                </div>
                <div class="article">
                    <h2 class="article-header">Gess My Prompt</h2>
                    <div class="article-content">
                        <img  @click="redirectTo('/choice-gmp')" src="../assets/GP-exemple.png" alt="article" />
                        <p class="content">
                            Devinez le prompt qui a servi à générer l'image. Votre réponse génère ensuite une nouvelle
                            image. <br> <br>Chaque tour est une nouvelle interprétation, offrant une expérience de jeu
                            visuel amusante et créative.
                        </p>
                    </div>
                </div>
                <div class="article">
                    <h2 class="article-header">BroCode</h2>
                    <div class="article-content">
                        <img @click="redirectToExternal('https://github.com/AdrienDhmx/Brocode')" src="../assets/brocode.png" alt="brocode">
                        <p class="contnet">
                            BroCode est un jeu de tir multijoueur en 2D, développé avec Flutter et le moteur Flame par 3 développeurs talentueux de l'ESGI. <br> <br> Dans ce jeu les joueurs s'affrontent dans une map utilisant diverses armes et stratégies pour dominer leurs adversaires. Avec ses graphismes stylisés et son gameplay fluide, BroCode offre une expérience de jeu immersive et intense, parfaite pour les amateurs de shooters multijoueurs.
                        </p>
                    </div>
                </div>
                <div class="article">
                    <h2 class="article-header">Le Réel cout de l'ia</h2>
                    <div class="article-content bot">
                        <div class="content">
                            <div>
                                <p>L'IA générative a un impact environnemental significatif :</p>
                                <h4>1. Consommation Énergétique</h4>
                                <p>Les modèles d'IA consomment énormément d'énergie et émettent beaucoup de CO2.</p>
                                <h4>2. Empreinte Carbone</h4>
                                <p>Les centres de données ont une empreinte carbone élevée, surtout avec des
                                    combustibles fossiles.</p>
                                <h4>3. Ressources Matérielles</h4>
                                <p>La fabrication des composants utilise des minéraux rares, impactant l'environnement.
                                </p>
                                <h4>4. Solutions</h4>
                                <p>Optimiser les modèles, utiliser des énergies renouvelables, recycler les composants.
                                </p>
                                <h4>5. Sensibilisation et Régulation</h4>
                                <p>Établir des normes environnementales strictes et promouvoir la transparence.</p>
                                <br>
                                <p>Réduire l'impact écologique de l'IA est essentiel pour un avenir durable.</p>
                                <br>
                            </div>
                        </div>
                        <img src="../assets/cost_ai.jpg" alt="article" />
                    </div>

                </div>
            </div>
        </div>
        <div class="chat-container">
            <chat :roomId="1" roomName="" maxHeight="100rem" class="chat" />
        </div>
    </main>
</template>

<style scoped lang="scss">
.home {
    height: 100vh;
    background: var(--bg-color);
    border: solid var(--bg-color-elements);
    display: flex;
    width: 100%;
    overflow: hidden;

    .feed {
        flex: 1;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        overflow-y: auto; // Permet le défilement vertical

        .search {
            display: flex;

            input {
                padding-left: 1rem;
                width: 250px;
                height: 40px;
                border: 2px solid var(--bg-color-elements);
                border-radius: 8px;
            }

            button {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 40px;
                height: 40px;
                border: solid var(--bg-color-elements);
                border-radius: 8px;
                color: var(--color-text);
            }
        }

        .feed-container {
            flex: 1; // Permet à ce conteneur de prendre tout l'espace restant
            display: flex;
            flex-direction: column;
            margin-top: 2rem;
            width: 100%;

            h2 {
                font-size: 2rem;
                color: var(--color-text);
                font-family: Arial, Helvetica, sans-serif;
            }

            .article {
                display: flex;
                flex-direction: column;
                margin-top: 2rem;
                border: solid 2px var(--bg-color-elements);
                border-radius: 8px;
                padding: 1rem;
                background: var(--bg-color-elements);

                .article-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;

                    .article-title {
                        font-size: 1.5rem;
                        color: var(--color-text);
                    }

                    .article-date {
                        font-size: 1rem;
                        color: var(--color-text);
                    }
                }

                .article-content {
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                    font-size: 1.2rem;
                    color: var(--color-text);
                    flex-grow: 1;

                    img {
                        width: 40%;
                        cursor: pointer;
                        height: auto;
                        border-radius: 8px;
                        margin-right: 20px;
                        object-fit: cover;
                    }
    
                    .content {
                        flex: 1.2;
                    }

                    &.bot {
                        flex-direction: column;

                        img {
                            width: 100%;
                            cursor: default;

                        }
                    }
                }

            }
        }
    }

    .chat-container {
        display: none;
    }

    @media (min-width: 1024px) {
        .feed {
            flex: 1.4;
        }

        .chat-container {
            display: block;
            flex: 0.6;
            width: 100%;
            height: 100vh;
            border-left: solid 10px var(--bg-color-elements);
            position: sticky;
            top: 0;
        }
    }
}
</style>
