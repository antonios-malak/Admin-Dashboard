import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { notify } from '@/utils/notify'
import i18n from '@/i18n'

export interface FlatPermission {
  id: number
  name: string
  display_name: string
  category: string // key like 'admins_toggle'
}

export const usePermissionsStore = defineStore('permissions', () => {
  const permissions = ref<FlatPermission[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const groups = ref<Record<string, { title: string; permissions: FlatPermission[] }>>({})

  const fetchPermissions = async () => {
    try {
      loading.value = true
      error.value = null
      const res = await api.get('/permissions')
      // shape: data: { key: { title, permissions: [ {...} ] }, ... }
      const obj = res.data?.data || res.data || {}
      const flat: FlatPermission[] = []
      const grouped: Record<string, { title: string; permissions: FlatPermission[] }> = {}
      Object.keys(obj).forEach((key) => {
        const group = obj[key]
        const items: any[] = Array.isArray(group?.permissions) ? group.permissions : []
        items.forEach((p: any) => {
          flat.push({
            id: p.id,
            name: p.name,
            display_name: p.display_name,
            category: key
          })
        })
        grouped[key] = {
          title: group?.title || key,
          permissions: items.map((p: any) => ({
            id: p.id,
            name: p.name,
            display_name: p.display_name,
            category: key
          }))
        }
      })
      permissions.value = flat
      groups.value = grouped
      notify('success', res?.data?.message || i18n.global.t('permissions.messages.success.refreshed'), i18n.global.t('permissions.title'))
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to fetch permissions'
      notify('error', error.value || 'Error', i18n.global.t('permissions.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const updatePermissions = async () => {
    try {
      loading.value = true
      error.value = null
      const res = await api.post('/permissions/update')
      await fetchPermissions()
      notify('success', res?.data?.message || i18n.global.t('permissions.messages.success.refreshed'), i18n.global.t('permissions.title'))
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to update permissions'
      notify('error', error.value || 'Error', i18n.global.t('permissions.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  return { permissions, groups, loading, error, fetchPermissions, updatePermissions }
})


