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
  role: string
  status: 'active' | 'inactive'
  avatar?: string
  permissions?: string[]
  createdAt: string
  updatedAt: string
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
      if (!grouped[user.role]) {
        grouped[user.role] = []
      }
      grouped[user.role].push(user)
    })
    return grouped
  })

  // Actions
  const fetchUsers = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/users')
      users.value = response.data.data || response.data
      
      notify('success', t('users.messages.success.userAdded'), t('users.title'))
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('users.messages.error.fetchUsers')
      notify('error', error.value || t('users.messages.error.fetchUsers'), t('users.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const addUser = async (formData: UserFormData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/users', formData)
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

  const updateUser = async (userId: string | number, formData: Partial<UserFormData>) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.put(`/users/${userId}`, formData)
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
      
      await api.delete(`/users/${userId}`)
      
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

  const toggleUserStatus = async (userId: string | number) => {
    try {
      loading.value = true
      error.value = null
      
      const user = users.value.find(u => u.id === userId)
      if (!user) {
        throw new Error('User not found')
      }
      
      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      
      const response = await api.patch(`/users/${userId}/toggle-status`, {
        status: newStatus
      })
      
      const updatedUser = response.data.data || response.data
      
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      
      notify('success', t('users.messages.success.statusChanged'), t('users.title'))
      
      return updatedUser
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
      user.role.toLowerCase().includes(lowercaseQuery)
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