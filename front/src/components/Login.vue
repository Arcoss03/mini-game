<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type logIn } from '@/interfaces/user';
import apiHelper from '@/helpers/apiHelper';
import { useUtilsStore } from '@/stores/utilsStore';
import router from '@/router';
import NavBar from './NavBar.vue';

const showToast = useUtilsStore().showToast;

let username: Ref<string> = ref('');
let password: Ref<string> = ref('');

let passwordFieldType: Ref<string> = ref('password');

let eyeIconSrc = ref('/src/assets/les-yeux-croises.png');

function ViewPassword() {
    if (passwordFieldType.value === 'password') {
        passwordFieldType.value = 'text';
        eyeIconSrc.value= '/src/assets/oeil.png'; 
    } else {
        passwordFieldType.value = 'password';
        eyeIconSrc.value = '/src/assets/les-yeux-croises.png'; 
    }
}
async function Login() {
    const postData: logIn = {
        "username": username.value,
        "password": password.value,

    };
    // Utiliser ky pour envoyer les données
    const res = await apiHelper.kyPostWithoutToken('auth/login', postData);
    if (!res.success) {
        showToast('email, pseudo ou mot de passe incorrect', false);
    } else {
        localStorage.setItem('token', res.data.token as string);
        showToast('Connexion réussie', true);
        return router.push('/profil')
    }
}


</script>

<template>
    <NavBar />
    <main>
        <div class="blush">
            <div class="imgContainer">
                <img src="../assets/logo.svg" alt="logo">
            </div>

        </div>

        <form @submit.prevent="Login()">
            <div>
                <label for="username"></label>
                <input v-model="username" placeholder="username" required>
            </div>

            <div class="password_container">
                <label for="password"></label>
                <input :type="passwordFieldType" v-model="password" placeholder="Password"  required>
                <img @click="ViewPassword" :src="eyeIconSrc" alt="oeil" class="icon">
            </div>
            <a href="/signup">Sign in</a>
            <button type=submit>Log In</button>
        </form>


    </main>
</template>

<style scoped lang="scss">
main {
    min-height: 100vh;
    background: #211D2A;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .blush {
        margin-top: 5rem;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;


        .imgContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;


            &::before {
                width: 11rem;
                height: 11rem;
                content: '';
                position: absolute;
                background: radial-gradient(ellipse at top left, #EC1414 15%, #7D50DD 100%);
                border-radius: 999px;
                filter: blur(30px);
            }
        }


        img {
            width: 11rem;
            padding: 2.5rem;
            margin-left: center;
            position: relative;
            z-index: 1;
        }

    }

    form {
        margin: 4.9rem 2rem 0 2rem;
        max-width: 30rem;
        min-width: 8rem;
        width: 80%;


        input {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            border-radius: 12px;
            font-size: 16px;
            font-family: Arial, Helvetica, sans-serif;
            padding-left: 2rem;
            padding-right:4rem;
            width: 100%;
            margin-bottom: 1rem;

            &::-ms-reveal {
                display: none;
            }

            &::placeholder {
                color: #BEBEBE;
                font-size: 16px;
                font-family: Arial, Helvetica, sans-serif;
            }
        }

        .password_container {
            position: relative;

            .icon {
                position: absolute;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                right:20px;
                top: 22px;
                cursor: pointer;
            }
        }

        div {
            margin-top: 0.5rem;
        }

        a {
            display: block;
            text-decoration: none;
            color: #BEBEBE;
            font-size: 16px;
            font-family: Arial, Helvetica, sans-serif;
            text-align: right;
            width: 100%;
            padding-right: 1rem;
        }

        button {
            margin-top: 1.5rem;
            border: solid #BEBEBE;
            border-radius: 12px;
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            width: 30%;
            margin-left: auto;
            margin-right: auto;
            color: #BEBEBE;
            font-size: 16px;
            font-family: Arial, Helvetica, sans-serif;
        }

    }

}
</style>
