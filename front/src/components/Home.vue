<script setup lang="ts">

import { onMounted, ref, type Ref } from 'vue';
import { useUtilsStore } from '@/stores/utilsStore';
import { useRouter } from 'vue-router';
import Chat from './Chat.vue';

let searchTerm = ref('');
let router = useRouter();

const submitForm = () => {
    router.push(`/profil/${searchTerm.value}`);
};

</script>


<template>
    <main class="home">
        <div class="feed">
            <form @submit.prevent="submitForm">
                <div class="search">
                    <input type="text" name="test" v-model="searchTerm" placeholder="recherche">
                    <button type="submit">
                        <img src="../assets/search.svg" alt="">
                    </button>
                </div>
            </form>
            <div class="feed-container">
                <h1>Feed</h1>
                <div class="article">
                    <h1 class="article-header">The cost of IA</h1>
                    <p class="article-content">L'IA générative, qui crée des contenus comme des textes, images et vidéos, a un impact environnemental significatif. Voici les principaux points à considérer :</p> 
                    <br>
                    <h2>1. Consommation Énergétique</h2>
                    <p class="article-content">L'entraînement des modèles d'IA comme GPT-4 nécessite une énorme quantité d'énergie. Un seul grand modèle peut émettre autant de CO2 qu'une voiture parcourant des centaines de milliers de kilomètres.</p>
                    <h2>2. Empreinte Carbone</h2>
                    <p class="article-content">L'empreinte carbone des centres de données dépend de leur source d'énergie. Dans les régions utilisant des combustibles fossiles, cette empreinte est particulièrement élevée.</p>
                    <h2>3. Ressources Matérielles</h2>
                    <p class="article-content">La fabrication des composants électroniques requiert des minéraux rares et des métaux, dont l'extraction impacte l'environnement.</p>
                    <h2>4. Solutions</h2>
                    <p class="article-content">Optimisation des modèles pour une efficacité énergétique accrue. Énergies renouvelables pour alimenter les centres de données. Recyclage des composants électroniques. Amélioration de l'efficacité énergétique des centres de données.</p>
                    <h2>5. Sensibilisation et Régulation</h2>
                    <p class="article-content">Les entreprises et les décideurs doivent établir des normes environnementales strictes et promouvoir la transparence sur l'empreinte écologique des projets d'IA.</p>
                    <h2>Conclusion</h2>
                    <p>Réduire l'impact écologique de l'IA générative est essentiel pour un avenir durable. Adopter des pratiques plus responsables et durables dans le développement de l'IA est une nécessité.</p>

                    <p class="article-date">Chat-GPT 06/07/2024</p>
                </div>

                <div class="article">
                    <h1 class="article-header">IA-game</h1>
                    <p class="article-content">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum similique temporibus sapiente non nobis, ex atque blanditiis consequatur sed nesciunt soluta reiciendis necessitatibus possimus incidunt quidem praesentium dolorem tempore maiores.</p> 
                    <br>
                    <h2>1. </h2>
                    <p class="article-content">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloribus, enim perspiciatis quisquam voluptates veniam id nisi vitae incidunt veritatis ducimus nostrum suscipit nulla, ratione itaque commodi optio explicabo numquam. Totam.</p>
                    <h2>2. </h2>
                    <p class="article-content">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum consectetur magnam omnis suscipit necessitatibus fugiat doloribus porro cumque at deleniti! Non nisi dolores incidunt ex ea velit rerum quis nam!</p>
                    <h2>3. </h2>
                    <p class="article-content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis itaque laboriosam quos sequi aspernatur sapiente. Nostrum dicta voluptatem minus! Ipsum ea corporis harum nisi alias accusantium vel iste cupiditate necessitatibus.</p>
                    <h2>4. </h2>
                    <p class="article-content">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam voluptatum at reiciendis, deleniti doloremque inventore eum debitis sapiente maiores illo harum neque. Voluptatem labore nisi qui voluptatum, recusandae doloremque fugit.</p>
                    <h2>Conclusion</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam perspiciatis hic aliquam eum voluptatum. Vel deleniti modi ipsa libero corporis corrupti cum dolorum quam, nisi aspernatur vitae excepturi error eius!</p>

                    <p class="article-date">Chat-GPT 06/07/2024</p>
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
    min-height: 100vh;
    background: var(--bg-color);
    border: solid var(--bg-color-elements);
    display: flex;
    width: 100%;
    // overflow: hidden;

    .feed {
        flex: 1;
        margin: 2rem;

        .search {
            display: flex;
            

            input {
                padding-left: 1rem;
                width: 250px;
                height: 40px;
                border: 2px solid var(--color-text);
                border-radius: 8px;
            }

            button {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 40px;
                height: 40px;
                border: solid #fff;
                border-radius: 8px;
                color: var(--color-text);
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
        
        .feed-container {
            display: flex;
            flex-direction: column;
            margin-top: 2rem;
            h1 {
                font-size: 3rem;
                color: var(--color-text);
                font-family :Arial, Helvetica, sans-serif ;
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
                    font-size: 1.2rem;
                    color: var(--color-text);
                }
            }
        }
    }



}
</style>
