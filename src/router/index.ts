import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/login', component: () => import('@/pages/Auth/login.vue') },
  { path: '/forgot', component: () => import('@/pages/Auth/Forgot.vue') },
  { path: '/otp', component: () => import('@/pages/Auth/otp.vue') },
  { path: '/resetpassword', component: () => import('@/pages/Auth/ResetPassword.vue') },

  { 
    path: '/', 
    component: () => import('@/components/App/AppLayout.vue'),
    children: [
      { path: '/', component: () => import('@/pages/Dashboard.vue') },
      { path: 'my-account', component: () => import('@/pages/MyAccount.vue') },
      { path: 'notifications', component: () => import('@/pages/Notifications.vue') },
        { path: 'users', component: () => import('@/pages/Users.vue') },
        { path: 'roles', component: () => import('@/pages/Roles.vue') },
        { path: 'permissions', component: () => import('@/pages/Permissions.vue') },
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
