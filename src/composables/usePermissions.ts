import { ref, computed } from 'vue'
import api from '@/utils/api'
import { notify } from '@/utils/notify'
import { useI18n } from 'vue-i18n'

export interface Permission {
  id: string | number
  name: string
  createdAt: string
  updatedAt: string
}

export function usePermissions() {
  const { t } = useI18n()
  const permissions = ref<Permission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const permissionsCount = computed(() => permissions.value.length)

  // Actions
  const fetchPermissions = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/permissions')
      permissions.value = response.data || []
      notify('success', t('permissions.messages.success.refreshed'), 'Success')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch permissions'
      notify('error', error.value || t('permissions.messages.error.fetchPermissions'), t('permissions.title'))
    } finally {
      loading.value = false
    }
  }

  const refreshPermissions = async () => {
    await fetchPermissions()
  }

  return {
    // State
    permissions,
    loading,
    error,
    
    // Computed
    permissionsCount,
    
    // Actions
    fetchPermissions,
    refreshPermissions
  }
}
