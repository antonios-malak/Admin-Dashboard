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
      { path: 'admins', component: () => import('@/pages/Admins.vue') },
      { path: 'roles', component: () => import('@/pages/Roles.vue') },
      { path: 'permissions', component: () => import('@/pages/Permissions.vue') },
      { path: 'auto-consultation', component: () => import('@/pages/AutoConsultation.vue') },
      { path: 'emojis', component: () => import('@/pages/Emojis.vue') },
      
      // Medical Management
      { path: 'doctors', component: () => import('@/pages/Doctors.vue') },
      { path: 'specialities', component: () => import('@/pages/Specialities.vue') },
      { path: 'follow-ups', component: () => import('@/pages/FollowUps.vue') },
      
      // Content Management
      { path: 'filter-requests', component: () => import('@/pages/FilterRequests.vue') },
      { path: 'community-posts', component: () => import('@/pages/CommunityPosts.vue') },
      { path: 'advertisements', component: () => import('@/pages/Advertisements.vue') },
      { path: 'exercises', component: () => import('@/pages/Exercises.vue') },
      { path: 'sliders', component: () => import('@/pages/Sliders.vue') },
      
      // Static Content
      { path: 'about', component: () => import('@/pages/AppContent/About.vue') },
      { path: 'terms', component: () => import('@/pages/AppContent/Terms.vue') },
      { path: 'privacy', component: () => import('@/pages/AppContent/Privacy.vue') },
      
      // Settings & Management
      { path: 'settings', component: () => import('@/pages/Settings.vue') },
      { path: 'contact-us', component: () => import('@/pages/ContactUs.vue') },
      { path: 'faqs', component: () => import('@/pages/FAQs.vue') },
      { path: 'app-pages', component: () => import('@/pages/AppPages.vue') },
      
      // Locations Management
      { path: 'locations/countries', component: () => import('@/pages/Locations/Countries.vue') },
      { path: 'locations/regions', component: () => import('@/pages/Locations/Regions.vue') },
      { path: 'locations/cities', component: () => import('@/pages/Locations/Cities.vue') },
      { path: 'locations/districts', component: () => import('@/pages/Locations/Districts.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/forgot',
  '/otp',
  '/resetpassword'
]

// Routes that require reset token authorization
const resetTokenRoutes = [
  '/resetpassword'
]

// Route guard middleware
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  // Check if route is public
  if (publicRoutes.includes(to.path)) {
    // If user is already logged in and trying to access auth pages, redirect to dashboard
    if (authStore.isLoggedIn && (to.path === '/login' || to.path === '/forgot')) {
      return next('/')
    }
    return next()
  }
  
  // Check if route requires reset token
  if (resetTokenRoutes.includes(to.path)) {
    if (!authStore.isResetAuthorized) {
      return next('/forgot')
    }
    return next()
  }
  
  // Check if user is authenticated for protected routes
  if (!authStore.isLoggedIn) {
    return next('/login')
  }
  
  // User is authenticated, allow access
  next()
})

export default router
