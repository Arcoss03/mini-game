import { ref } from 'vue'
import { defineStore } from 'pinia'
import  apiHelper from '../helpers/apiHelper';

export const useUserStore = defineStore('userStore', () => {
    const isLogedIn = ref(false);

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
