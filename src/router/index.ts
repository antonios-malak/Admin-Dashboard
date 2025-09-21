import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/login', component: () => import('@/pages/Auth/login.vue') },
  { path: '/forgot', component: () => import('@/pages/Auth/forgot.vue') },
  { path: '/otp', component: () => import('@/pages/Auth/otp.vue') },
  { path: '/resetpassword', component: () => import('@/pages/Auth/resetpassword.vue') },

  { 
    path: '/', 
    component: () => import('@/components/App/AppLayout.vue'),
    children: [
      { path: '/', component: () => import('@/pages/Dasboard.vue') },
      { path: 'products', component: () => import('@/pages/Products.vue') },
      { path: 'categories', component: () => import('@/pages/Categories.vue') },
      { path: 'customers', component: () => import('@/pages/Customers.vue') },
      { path: 'orders', component: () => import('@/pages/Orders.vue') },
      { path: 'reports', component: () => import('@/pages/Reports.vue') },
      { path: 'settings', component: () => import('@/pages/Settings.vue') },
      // { path: 'entries', component: () => import('@/pages/entries.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Route Guard
router.beforeEach((to) => {
  const auth = useAuthStore()
  const publicRoutes = ['/login', '/forgot' , '/otp' , '/resetpassword']
  if (!auth.isLoggedIn && !publicRoutes.includes(to.path)) {
    return '/login'
  }
})

export default router
