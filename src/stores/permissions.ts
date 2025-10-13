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
      const payload = res.data?.data || res.data || {}
      const flat: FlatPermission[] = []
      const grouped: Record<string, { title: string; permissions: FlatPermission[] }> = {}

      const toSlug = (str: string, fallback: string) => {
        if (!str || typeof str !== 'string') return fallback
        return str
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/(^-|-$)/g, '') || fallback
      }

      if (Array.isArray(payload)) {
        // New shape: data: [ { title, permissions: [ ... ] }, ... ]
        payload.forEach((group: any, idx: number) => {
          const key = toSlug(group?.title, `group-${idx}`)
          const items: any[] = Array.isArray(group?.permissions) ? group.permissions : []
          const mapped = items.map((p: any) => ({
            id: p.id,
            name: p.name,
            display_name: p.display_name,
            category: key
          }))
          mapped.forEach((m) => flat.push(m))
          grouped[key] = {
            title: group?.title || key,
            permissions: mapped
          }
        })
      } else {
        // Old shape: data: { key: { title, permissions: [ ... ] }, ... }
        Object.keys(payload).forEach((key) => {
          const group = payload[key]
          const items: any[] = Array.isArray(group?.permissions) ? group.permissions : []
          const mapped = items.map((p: any) => ({
            id: p.id,
            name: p.name,
            display_name: p.display_name,
            category: key
          }))
          mapped.forEach((m) => flat.push(m))
          grouped[key] = {
            title: group?.title || key,
            permissions: mapped
          }
        })
      }
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


