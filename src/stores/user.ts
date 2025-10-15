import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'
import { notify } from '@/utils/notify'
import i18n from '@/i18n'

// User interface
export interface User {
  id: string | number
  name: string
  email: string
  phone?: string
  role: { id: string | number; name: string }
  status: 'active' | 'inactive'
  avatar?: string
  permissions?: string[]
  createdAt: string
  updatedAt: string
  is_active: number
  image?: string
  created_at: string
  last_login_at?: string | null
  locale?: string
  login_count?: number
  reason_to_deactivate?: string | null
}

// Form data interface for creating/updating users
export interface UserFormData {
  name: string
  email: string
  phone?: string
  password?: string
  role: string
  status?: 'active' | 'inactive'
  permissions?: string[]
}

// Helper function to get translations
const t = (key: string) => i18n.global.t(key)

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // server-side pagination state
  const currentPage = ref(1)
  const perPage = ref(10)
  const totalItems = ref(0)
  const lastPage = ref(1)

  // Getters
  const activeUsers = computed(() => 
    users.value.filter(user => user.status === 'active')
  )
  
  const inactiveUsers = computed(() => 
    users.value.filter(user => user.status === 'inactive')
  )
  
  const totalUsers = computed(() => users.value.length)
  
  const usersByRole = computed(() => {
    const grouped: Record<string, User[]> = {}
    users.value.forEach(user => {
      const roleKey = user.role?.name || 'Unknown'
      if (!grouped[roleKey]) {
        grouped[roleKey] = []
      }
      grouped[roleKey].push(user)
    })
    return grouped
  })

  // Actions
  const fetchUsers = async (page = 1) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/admins', { params: { page } })
      const payload = response.data || {}
      users.value = payload?.data || []
      const meta = payload?.meta || {}
      currentPage.value = Number(meta?.current_page) || page
      perPage.value = Number(meta?.per_page) || perPage.value
      totalItems.value = Number(meta?.total) || (Array.isArray(payload?.data) ? payload.data.length : 0)
      lastPage.value = Number(meta?.last_page) || lastPage.value
      
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('users.messages.error.fetchUsers')
      notify('error', error.value || t('users.messages.error.fetchUsers'), t('users.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const addUser = async (formData: UserFormData | FormData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/admins', formData)
      const newUser = response.data.data || response.data
      
      users.value.push(newUser)
      notify('success', t('users.messages.success.userAdded'), t('users.title'))
      
      return newUser
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('users.messages.error.addUser')
      notify('error', error.value || t('users.messages.error.addUser'), t('users.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userId: string | number, formData: Partial<UserFormData> | FormData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post(`/admins/${userId}?_method=PUT`, formData)
      const updatedUser = response.data.data || response.data
      
      const index = users.value.findIndex(user => user.id === userId)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      
      notify('success', t('users.messages.success.userUpdated'), t('users.title'))
      
      return updatedUser
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('users.messages.error.updateUser')
      notify('error', error.value || t('users.messages.error.updateUser'), t('users.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (userId: string | number) => {
    try {
      loading.value = true
      error.value = null
      
      await api.delete(`/admins/${userId}`)
      
      users.value = users.value.filter(user => user.id !== userId)
      notify('success', t('users.messages.success.userDeleted'), t('users.title'))
      
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('users.messages.error.deleteUser')
      notify('error', error.value || t('users.messages.error.deleteUser'), t('users.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleUserStatus = async (userId: string | number, reasonToDeactivate?: string) => {
    try {
      loading.value = true
      error.value = null
    
      const requestData: any = {}
      if (reasonToDeactivate) {
        requestData.reason_to_deactivate = reasonToDeactivate
      }
      
      const response = await api.post(`/admins/${userId}/toggle`, requestData)      
      
      notify('success', response.data.message || t('users.messages.success.statusChanged'), t('users.title'))
      
      // Refresh users list after successful status change
      await fetchUsers()
      
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('users.messages.error.toggleStatus')
      notify('error', error.value || t('users.messages.error.toggleStatus'), t('users.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const getUserById = (userId: string | number) => {
    return users.value.find(user => user.id === userId)
  }

  const searchUsers = (query: string) => {
    if (!query.trim()) return users.value
    
    const lowercaseQuery = query.toLowerCase()
    return users.value.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery) ||
      user.phone?.toLowerCase().includes(lowercaseQuery) ||
      user.role?.name?.toLowerCase().includes(lowercaseQuery)
    )
  }

  const clearError = () => {
    error.value = null
  }

  const resetStore = () => {
    users.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    users,
    loading,
    error,
    
    // server pagination exports
    currentPage,
    perPage,
    totalItems,
    lastPage,
    
    // Getters
    activeUsers,
    inactiveUsers,
    totalUsers,
    usersByRole,
    
    // Actions
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserById,
    searchUsers,
    clearError,
    resetStore
  }
})