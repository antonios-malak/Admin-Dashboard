import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'
import { notify } from '@/utils/notify'
import i18n from '@/i18n'
import { usePermissionsStore } from '@/stores/permissions'

// Role interface
export interface Role {
  id: string | number
  name: string
  permissions: Array<string | { id: number; name: string; display_name: string }>
  status?: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
  isSystemRole?: boolean // For system roles that cannot be deleted
}

// Form data interface for creating/updating roles
export interface RoleFormData {
  name: string
  permission: string[]
}

// Helper function to get translations
const t = (key: string) => i18n.global.t(key)

export const useRolesStore = defineStore('roles', () => {
  const permissionsStore = usePermissionsStore()
  
  // State
  const roles = ref<Role[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeRoles = computed(() => 
    roles.value.filter(role => role.status === 'active')
  )
  
  const inactiveRoles = computed(() => 
    roles.value.filter(role => role.status === 'inactive')
  )
  
  const totalRoles = computed(() => roles.value.length)
  
  const systemRoles = computed(() => 
    roles.value.filter(role => role.isSystemRole)
  )

  // Available permissions for selection (all permissions)
  const availablePermissions = computed(() => 
    permissionsStore.permissions.map(permission => permission.name)
  )

  // Actions
  const fetchRoles = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Fetch permissions first to populate availablePermissions
      await permissionsStore.fetchPermissions()
      
      const response = await api.get('/roles')
      roles.value = response.data.data || response.data
      
      notify('success', t('roles.messages.success.rolesFetched'), t('roles.title'))
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('roles.messages.error.fetchRoles')
      notify('error', error.value || t('roles.messages.error.fetchRoles'), t('roles.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const addRole = async (formData: RoleFormData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/roles', formData)
      const newRole = response.data.data || response.data
      
      roles.value.push(newRole)
      notify('success', t('roles.messages.success.roleAdded'), t('roles.title'))
      
      return newRole
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('roles.messages.error.addRole')
      notify('error', error.value || t('roles.messages.error.addRole'), t('roles.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRole = async (roleId: string | number, formData: Partial<RoleFormData>) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.put(`/roles/${roleId}`, formData)
      const updatedRole = response.data.data || response.data
      
      const index = roles.value.findIndex(role => role.id === roleId)
      if (index !== -1) {
        roles.value[index] = updatedRole
      }
      
      notify('success', t('roles.messages.success.roleUpdated'), t('roles.title'))
      
      return updatedRole
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('roles.messages.error.updateRole')
      notify('error', error.value || t('roles.messages.error.updateRole'), t('roles.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteRole = async (roleId: string | number) => {
    try {
      loading.value = true
      error.value = null
      
      await api.delete(`/roles/${roleId}`)
      
      roles.value = roles.value.filter(role => role.id !== roleId)
      notify('success', t('roles.messages.success.roleDeleted'), t('roles.title'))
      
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('roles.messages.error.deleteRole')
      notify('error', error.value || t('roles.messages.error.deleteRole'), t('roles.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleRoleStatus = async (roleId: string | number) => {
    try {
      loading.value = true
      error.value = null
      
      const role = roles.value.find(r => r.id === roleId)
      if (!role) {
        throw new Error('Role not found')
      }
      
      const newStatus = role.status === 'active' ? 'inactive' : 'active'
      
      const response = await api.patch(`/roles/${roleId}/toggle-status`, {
        status: newStatus
      })
      
      const updatedRole = response.data.data || response.data
      
      const index = roles.value.findIndex(r => r.id === roleId)
      if (index !== -1) {
        roles.value[index] = updatedRole
      }
      
      notify('success', t('roles.messages.success.statusChanged'), t('roles.title'))
      
      return updatedRole
    } catch (err: any) {
      error.value = err?.response?.data?.message || t('roles.messages.error.toggleStatus')
      notify('error', error.value || t('roles.messages.error.toggleStatus'), t('roles.title'))
      throw err
    } finally {
      loading.value = false
    }
  }

  const getRoleById = (roleId: string | number) => {
    return roles.value.find(role => role.id === roleId)
  }

  const searchRoles = (query: string) => {
    if (!query.trim()) return roles.value
    
    const lowercaseQuery = query.toLowerCase()
    return roles.value.filter(role => 
      role.name.toLowerCase().includes(lowercaseQuery)
    )
  }

  const filterRolesByStatus = (status: string) => {
    if (!status) return roles.value
    return roles.value.filter(role => role.status === status)
  }

  const clearError = () => {
    error.value = null
  }

  const resetStore = () => {
    roles.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    roles,
    loading,
    error,
    availablePermissions,
    
    // Getters
    activeRoles,
    inactiveRoles,
    totalRoles,
    systemRoles,
    
    // Actions
    fetchRoles,
    addRole,
    updateRole,
    deleteRole,
    toggleRoleStatus,
    getRoleById,
    searchRoles,
    filterRolesByStatus,
    clearError,
    resetStore
  }
})
