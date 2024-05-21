import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUtilsStore = defineStore('utils', () => {
  const fetchTokenUser = (): string | undefined => {
    const token = localStorage.getItem('token');
    return token ? token : undefined;
  }

  const setTokenUser = (token: string): void => {
    localStorage.setItem('token', token);
  }

  return { fetchTokenUser, setTokenUser }
})
