import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/customize',
      name: 'Customize',
      component: () => import('../views/Customize.vue')
    },
    {
      path: '/result',
      name: 'Result',
      component: () => import('../views/Result.vue')
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('../views/Chat.vue')
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('../views/User.vue')
    }
  ]
})

export default router