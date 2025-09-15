import { defineStore } from 'pinia'
import router from '../router'
import { notify } from '@/utils/notify'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({ 
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading : false

  }),
  getters: { isLoggedIn: (s) => !!s.token },
  actions: {
   async login(username: string, password: string) {
  try {
    this.loading = true
    const response = await api.post('/auth/login', {
      username,  // تغيير من email إلى user
      password
    })
    
    const { user, token } = response.data
    this.token = token
    this.user = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    notify('success', `Welcome back, ${user.name}!`, 'Login Successful')
    router.push('/')
    
  } catch (error: any) {
      notify('error', error.response.data.message, 'Login Failed')
    
  }finally{
    this.loading = false
  }
},
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }
})
