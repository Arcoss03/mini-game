import { ref } from 'vue'
import { defineStore } from 'pinia'
import  apiHelper from '../helpers/apiHelper';

export const useUserStore = defineStore('userStore', () => {
    const isLogedIn = ref(false); // This is a reactive variable that will be used to check if the user is logged in or not

    // Function to check if the user is logged in using the token (is used at the refresh of the page to keep the user logged in)
    const tokenLogin = async () => {
        const token = localStorage.getItem('token') as string;
        if(token) {
            const response = await apiHelper.kyPost('auth/token', {}, token);
            if(response.success) {
                isLogedIn.value = true;
            }
        }
    }

    

return { isLogedIn, tokenLogin}
})
