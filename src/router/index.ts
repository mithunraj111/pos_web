import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/main/Main.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import( '../views/main/home/Home.vue')
      }, {
        path: '/summary',
        name: 'Summary',
        component: () => import( '../views/main/summary/Summary.vue')
      }, {
        path: '/close-till',
        name: 'CloseTill',
        component: () => import( '../views/main/closetill/CloseTill.vue')
      }, {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/main/settings/Settings.vue')
      }
    ]
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/auth/Auth.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
