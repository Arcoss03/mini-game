<script setup lang="ts">
import apiHelper from '@/helpers/apiHelper';
import { onMounted, ref, type Ref} from 'vue';
import {type signUp} from '@/interfaces/user';

let email: Ref<string> = ref('');
let pseudo: Ref<string> = ref('');
let password: Ref<string> = ref('');
let confirmPassword: Ref<string> = ref('');


function compare():number{
    if (password.value === confirmPassword.value) {
    return 0;
  } else {
    console.log('Error: different passwords');
    return 1;
  }
}



async function SendPost() {
    
  try {
    compare()===0
    const postData: signUp = {
      email: email.value,
      pseudo: pseudo.value,
      password: password.value,
    };

    const res=await apiHelper.kyPostWithoutToken('/auth', postData);
    // Utiliser ky pour envoyer les données

  } catch (error) {
    // Avec ky, une erreur est lancée automatiquement si la réponse n'est pas ok
    console.error('Erreur lors de la requête :', error);
  }
}

</script>

<template>
  <main>
    <div class="blush" >
        <img src="../assets/logo.svg" alt="logo">
    </div>
    
    <form @submit.prevent="SendPost()">
      <div>
        <label for="Email"></label>
        <input v-model="email" placeholder="user@domain.com" type="email" required>
      </div>

      <div >
        <label for="pseudo"></label>
        <input v-model="pseudo" placeholder="Pseudo" required>
      </div>

      <div>
        <label for="password"></label>
        <input v-model="password" placeholder="Password"  type="password" required>
      </div>

      <div>
        <label for="confirmPassword"></label>
        <input v-model="confirmPassword" placeholder="Confirm password" type="password" required>
        <a href="/login">Already an account ?</a>
      </div>
      
      <button type=submit>Sign up</button>
    </form>
    

  </main>
</template>

<style scoped lang="scss">
main {
    min-height: 100vh;
    background: #17141D;
    border: solid #17141D;

    .blush {
        margin-top: 6rem;
        margin-left: auto;
        margin-right: auto;
        position: relative;
        width: 12%;

        &::before {
            content: ''; 
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at top left, #EC1414 15%, #7D50DD 100%);
            border-radius: 35%;
            filter: blur(30px);
        }

        img {
            width: 100%;
            padding: 2.5rem;
            margin-left: center;
            position: relative; 
            z-index: 1; 
        } 
        @media screen and (max-width: 1250px) {
            width: 15%; 
        }
        @media screen and (max-width: 1000px) {
            width: 20%; 
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
    form{
        margin-left: auto;
        margin-top: 4.9rem;
        margin-right: auto;
        width: 45%;
        
        input{
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            border-radius: 12px;
            color: #BEBEBE;
            font-size: 16px;
            font-family: Arial, Helvetica, sans-serif;
            padding-left: 2rem;
            width: 100%; 
            margin-bottom: 1rem;

            &::placeholder{
                color :#BEBEBE;
                font-size: 16px;
                font-family:Arial, Helvetica, sans-serif;
            }
        }
        div{
            margin-bottom: 0.5rem;
        }
        a{
        text-decoration: none;
        color:#BEBEBE;
        font-size: 16px;
        font-family:Arial, Helvetica, sans-serif;
        margin-left: 74%;
        @media screen and (max-width: 1300px) {
            margin-left: 70%; 
        }
    
        @media screen and (max-width: 750) {
            margin-left: 50%; 
        }
        
        @media screen and (max-width: 500px) {
            margin-left: 53%; 
        }
        @media screen and (max-width: 400px) {
            margin-left: 37%;
        }
        @media screen and (max-width: 300px) {
            margin-left: 30%; 
        }
        }    
        button{
            margin-top: 1.5rem;
            border:solid #BEBEBE;
            border-radius: 12px;
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
            width: 30%;
            margin-left: auto;
            margin-right:auto;
            color:#BEBEBE;
            font-size: 16px;
            font-family:Arial, Helvetica, sans-serif;
        }
        @media screen and (max-width: 1250px) {
            width: 70%; 
        }
        @media screen and (max-width: 1000px) {
            width: 70%; 
        }
        @media screen and (max-width: 900px) {
            width: 80%; 
        }
        @media screen and (max-width: 500px) {
            width: 80%; 
        }
        @media screen and (max-width: 400px) {
            width: 80%; 
            margin-top: 4rem;
        }
        @media screen and (max-width: 300px) {
            width: 80%; 
        }
        
    }
    
}

</style>
