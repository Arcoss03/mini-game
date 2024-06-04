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
      path: '/create',
      name: 'create',
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
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: () => import('../views/LobbyGFView.vue')
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    }

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
