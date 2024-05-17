import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUtilsStore = defineStore('utils', () => {

    const fetchTokenUser = (error: string, isSuccess: boolean): string => {
        const tokenElement = document.getElementById('token') as HTMLInputElement;
        if (tokenElement) {
          return tokenElement.value;
        } else {
          console.error(error);
          return '';
        }
      }

return {fetchTokenUser}
})
