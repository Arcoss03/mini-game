import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUtilsStore = defineStore('utils', () => {
  const toast = ref({
    message: '',
    isSuccess: false,
    isVisible: false
  })

  // Function to show a toast message true for green and false for red.
  //values of toast are used by the Toast component so just call this function and Toast appears :)
  const showToast = (error: string, isSuccess: boolean) => {
    toast.value.isVisible = true
    toast.value.isSuccess = isSuccess
    toast.value.message = error
    setTimeout(() => {
      toast.value.isVisible = false
    }, 3000)
  }

  // Function to get the token from the local storage
  const fetchTokenUser = (): string | undefined => {
    const token = localStorage.getItem('token')
    return token ? token : undefined
  }

  // Function to set the token in the local storage
  const setTokenUser = (token: string): void => {
    localStorage.setItem('token', token)
  }

  return { toast, showToast, setTokenUser, fetchTokenUser }
})
