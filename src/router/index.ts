// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import RacePage from '@/pages/Race.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { title: 'Horse Racing - Home' },
    },
    {
      path: '/race',
      name: 'race',
      component: RacePage,
      meta: { title: 'Horse Racing - Race Track' },
    },
  ],
})

// Update page title on route change
router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || 'Horse Racing'
  next()
})

export default router
