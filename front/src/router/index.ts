import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useUserStore } from '@/stores/userStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue')
    }
    ,{
      path: '/login',
      name: 'login',
      component: () => import('../views/LogInView.vue')
    },
    
    {
      path: '/create/tpf',
      name: 'createTpf',
      component: () => import('../views/PostCreationView.vue')
    },
    {
      path: '/tpf',
      name: 'tpf',
      component: () => import('../views/TuPreferesView.vue')
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('../views/PrivateProfileView.vue')
    },
    {
      path: '/profil/:pseudo',
      name: 'profil-public',
      component: () => import('../views/PublicProfileView.vue')
    },
    {

      path: '/lobby/:lobbyId',
      name: 'lobby',
      component: () => import('../views/LobbyGPView.vue'),
      props: true
    },
    {
      path: '/choice-gmp',
      name: 'choiceGmp',
      component: () => import('../views/LobbyGPcreation-joinView.vue'),
    },
    {
      path: '/join/gmp',
      name: 'joinGmp',
      component: () => import('../views/LobbyGPjoinView.vue'),
    },
    {
      path: '/create/gmp',
      name: 'createGmp',
      component: () => import('../views/LobbyGPcreateView.vue'),
    },
    {
      path: '/gmp/:gmpId',
      name: 'GameGmp',
      component: () => import('../views/GuessMyPromptView.vue'),
    },
    {

      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatGView.vue')

    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    //error pages
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('../views/errors/NotFoundView.vue')
    },
    {
      path: '/profil-not-found',
      name: 'profilNotFound',
      component: () => import('../views/errors/ProfilNotFoundView.vue')
    },

  ]
  
})

//list of protected routes by token
const routesRequiringAuth = ['profil'];

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if(!useUserStore().isLogedIn) {
    await useUserStore().tokenLogin();
  }
  if (routesRequiringAuth.includes(to.name as string) && !useUserStore().isLogedIn) {
    next({ name: 'login' }); // Redirige vers la page de login
  } else {
    next(); // Continue vers la route demandée
  }
});



export default router
