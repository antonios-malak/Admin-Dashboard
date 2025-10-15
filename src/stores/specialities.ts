import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'
import { notify } from '@/utils/notify'
import i18n from '@/i18n'

export interface SpecialityEmoji {
  id: string | number
  symbol: { en?: string; ar?: string }
  image?: string
  created_at?: string
  updated_at?: string
}

export interface Speciality {
  id: string | number
  name: { en?: string; ar?: string } | string
  color?: string
  emoji?: SpecialityEmoji
  description?: string
  is_active?: boolean | number
  status?: 'active' | 'inactive'
  image?: string
  created_at?: string
  updated_at?: string
}

const t = (key: string) => i18n.global.t(key)

export const useSpecialitiesStore = defineStore('specialities', () => {
  const specialities = ref<Speciality[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // server-side pagination state
  const currentPage = ref(1)
  const perPage = ref(10)
  const totalItems = ref(0)
  const lastPage = ref(1)

  const total = computed(() => specialities.value.length)
  const isActiveFlag = (val: boolean | number | undefined) => val === true || val === 1
  const activeItems = computed(() => specialities.value.filter(s => (s.status ? s.status === 'active' : isActiveFlag(s.is_active))))
  const inactiveItems = computed(() => specialities.value.filter(s => (s.status ? s.status === 'inactive' : !isActiveFlag(s.is_active))))

  const fetchSpecialities = async (page = 1) => {
    try {
      loading.value = true
      error.value = null
      const res = await api.get('/specialities', { params: { page } })
      const payload = res?.data || {}
      specialities.value = payload?.data || []
      const meta = payload?.meta || {}
      currentPage.value = Number(meta?.current_page) || page
      perPage.value = Number(meta?.per_page) || perPage.value
      totalItems.value = Number(meta?.total) || (Array.isArray(payload?.data) ? payload.data.length : 0)
      lastPage.value = Number(meta?.last_page) || lastPage.value
      notify('success', res?.data?.message || t('specialities.messages.fetched'), t('specialities.title'))
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || t('specialities.messages.error.fetch')
      notify('error', error.value || t('specialities.messages.error.fetch'), t('specialities.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchSpecialityById = async (id: string | number): Promise<Speciality> => {
    try {
      loading.value = true
      error.value = null
      const res = await api.get(`/specialities/${id}`)
      return res?.data?.data || res?.data
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to fetch speciality'
      notify('error', error.value || 'Failed to fetch speciality', t('specialities.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteSpeciality = async (id: string | number) => {
    try {
      loading.value = true
      error.value = null
      const res = await api.delete(`/specialities/${id}`)
      specialities.value = specialities.value.filter(s => s.id !== id)
      notify('success', res?.data?.message || t('specialities.messages.success.deleted'), t('specialities.title'))
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || t('specialities.messages.error.delete')
      notify('error', error.value || t('specialities.messages.error.delete'), t('specialities.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const toggleSpecialityStatus = async (id: string | number) => {
    try {
      loading.value = true
      error.value = null
      const res = await api.post(`/specialities/${id}/toggle`)
      const msg = res?.data?.message || t('specialities.messages.success.toggled')
      notify('success', msg, t('specialities.title'))
      await fetchSpecialities()
    } catch (e: any) {
      const backendMsg = e?.response?.data?.message || e?.message || t('specialities.messages.error.toggle')
      error.value = backendMsg
      notify('error', backendMsg, t('specialities.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const addSpeciality = async (formData: FormData) => {
    try {
      loading.value = true
      error.value = null
      const res = await api.post('/specialities', formData)
      const created = res?.data?.data || res?.data
      specialities.value.push(created)
      notify('success', res?.data?.message || t('specialities.messages.success.created'), t('specialities.title'))
      return created
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || t('specialities.messages.error.create')
      notify('error', error.value || t('specialities.messages.error.create'), t('specialities.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateSpeciality = async (id: string | number, formData: FormData) => {
    try {
      loading.value = true
      error.value = null
      const res = await api.post(`/specialities/${id}?_method=PUT`, formData)
      const updated = res?.data?.data || res?.data
      const idx = specialities.value.findIndex(s => s.id === id)
      if (idx !== -1) specialities.value[idx] = updated
      notify('success', res?.data?.message || t('specialities.messages.success.updated'), t('specialities.title'))
      return updated
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || t('specialities.messages.error.update')
      notify('error', error.value || t('specialities.messages.error.update'), t('specialities.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const searchSpecialities = (query: string) => {
    const q = (query || '').toLowerCase().trim()
    if (!q) return specialities.value
    return specialities.value.filter((s) => {
      const name = s.name
      if (typeof name === 'string') return name.toLowerCase().includes(q)
      const en = name?.en?.toLowerCase() || ''
      const ar = name?.ar?.toLowerCase() || ''
      return en.includes(q) || ar.includes(q)
    })
  }
  const clearError = () => { error.value = null }
  const resetStore = () => { specialities.value = []; loading.value = false; error.value = null }

  return {
    specialities,
    loading,
    error,
    total,
    // server pagination exports
    currentPage,
    perPage,
    totalItems,
    lastPage,
    activeItems,
    inactiveItems,
    fetchSpecialities,
    fetchSpecialityById,
    deleteSpeciality,
    toggleSpecialityStatus,
    addSpeciality,
    updateSpeciality,
    searchSpecialities,
    clearError,
    resetStore
  }
})


