import { createRouter, createWebHistory } from 'vue-router'
import ClientsView from '../views/ClientsView.vue'
import AccountsView from '../views/AccountsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'clients',
      component: ClientsView
    },
    {
      path: '/accounts',
      name: 'accounts',
      // // route level code-splitting
      // // this generates a separate chunk (About.[hash].js) for this route
      // // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue')
      component: AccountsView
    }
  ]
})

export default router
