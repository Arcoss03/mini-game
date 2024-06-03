<script setup lang="ts">
import { onMounted, ref, type Ref} from 'vue';
import { useUtilsStore } from '@/stores/utilsStore';

const showToast = useUtilsStore().showToast;




</script>

<template>
    <main class="home">
        <nav>
            <li class="list-item">
                <div class="logo">
                    <img src="../assets/logo.svg" alt="logo">
                    <h2>Mini-game IA</h2>
                </div>
                <div class="nav">
                    <a href="/tpf">TPF</a>
                    <h2>Gartic</h2>
                    <h2>Shop</h2>
                </div>
                <div class="tools">
                    <a href="/login"><img src="" alt="login"> </a>
                    <a href=""></a>
                </div>
                
            </li>
        </nav>
    </main>
</template>

<style scoped lang="scss">
main {
    min-height: 100vh;
    background: #17141D;
    border: solid #17141D;

    .home {
        min-height: 100vh;
        background: #000000;
        border: solid #17141D;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;


        .logo {
        margin-top: 6rem;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        width: 50px;
        height: 50px;

        img {
            width: 100%;
            height: 100%;
            margin-left: auto;
            position: relative;
            z-index: 1;
        } 
        @media screen and (max-width: 1250px) {
            width: 15%;
            height: auto;
        }
        @media screen and (max-width: 1000px) {
            width: 20%; 
            height: auto;
        }
        @media screen and (max-width: 900px) {
            width: 30%; 
        }
        @media screen and (max-width: 500px) {
            width: 40%; 
        }
        @media screen and (max-width: 400px) {
            width: 50%; 
            margin-top: 4rem;
        }
        @media screen and (max-width: 300px) {
            width: 60%; 
        }
    }

        .game-title {
            color: #fff;
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

    }
    
    .list-item {
        display: flex;
        justify-content: space-between;
        list-style: none;
        padding: 1rem 2rem;
        background: #17141D;
        border: solid #17141D;
        border-radius: 1rem;
        margin-top: 1rem;
        margin-right: 1rem;
        margin-left: 1rem;
        width: 100%;
        max-width: 30rem;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
            transform: translateY(-0.5rem);
            box-shadow: 0 0 1rem rgba(0, 0, 0, 0.4);
        }

        h2 {
            color: #fff;
            font-size: 1.5rem;
            margin-right: 1rem;
        }

        a {
            color: #fff;
            font-size: 1.5rem;
            text-decoration: none;
            transition: all 0.3s ease;

            &:hover {
                color: #7D50DD;
            }
        }
        .nav, .tools {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin: 0 1rem;
        }
    }
}

</style>
