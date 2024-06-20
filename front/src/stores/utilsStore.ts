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

  // Function des themes
  const theme = ref(localStorage.getItem('theme') || 'dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }

  const applyTheme = (theme: string) => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }

  // Appeler cette fonction pour appliquer le thème actuel au body
  const initializeTheme = () => {
    applyTheme(theme.value)
    checkNavBar()
  }

  const hideNavBar = ref(localStorage.getItem('navBar') || 'show')

  // hide ou show la nav bar
  const toogleNavBar = () => {
    hideNavBar.value = hideNavBar.value === 'show' ? 'hide' : 'show'
    localStorage.setItem('navBar', hideNavBar.value)
    checkNavBar()
  }

  const checkNavBar = () => {
    if (hideNavBar.value === 'show') {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    } 
  }

  const isNavbarOpen = () => {
    return (hideNavBar.value === 'show');
  }

  return { toast, showToast, setTokenUser, fetchTokenUser, toggleTheme, initializeTheme, checkNavBar, toogleNavBar, isNavbarOpen}
})
