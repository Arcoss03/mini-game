<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type logIn } from '@/interfaces/user';
import apiHelper from '@/helpers/apiHelper';
import { useUtilsStore } from '@/stores/utilsStore';
import router from '@/router';


const showToast = useUtilsStore().showToast;

let username: Ref<string> = ref('');
let password: Ref<string> = ref('');

let passwordFieldType: Ref<string> = ref('password');

let eyeIconBool = ref(false);

const toogleEyeIcon = () => {
    eyeIconBool.value = !eyeIconBool.value;
    if (eyeIconBool.value) {
        passwordFieldType.value = 'text';
    } else {
        passwordFieldType.value = 'password';
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
                <img v-if="eyeIconBool" @click="toogleEyeIcon" src="../assets/oeil.svg" alt="oeil" class="icon">
                <img v-if="!eyeIconBool" @click="toogleEyeIcon" src="../assets/oeilFerme.svg" alt="oeil" class="icon">
            </div>
            <a href="/signup">Sign in</a>
            <button type=submit class="button">Log In</button>
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
                width: 10rem;
                height: 10rem;
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
            margin-top: 0.5rem;
            height: 3rem;
            background-color: #7D50DD;
            font-size: 18px;

            &:focus {
                box-shadow: #6C63FF 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6C63FF 0 -3px 0 inset;
            }

            &:active {
                box-shadow: #6C63FF 0 3px 7px inset;
                transform: translateY(2px);
            }

            &:hover {
                box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #6C63FF 0 -3px 0 inset;
                transform: translateY(-2px);
            }
        }

    }

}
</style>
