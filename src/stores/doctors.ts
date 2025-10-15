import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'
import { notify } from '@/utils/notify'
import i18n from '@/i18n'

export interface Doctor {
  id: string | number
  name: string
  email?: string
  phone?: string
  specialty?: string
  status?: 'active' | 'inactive'
  is_active?: number
  image?: string
  created_at?: string
  updated_at?: string
}

const t = (key: string) => i18n.global.t(key)

export const useDoctorsStore = defineStore('doctors', () => {
  const doctors = ref<Doctor[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // server-side pagination state
  const currentPage = ref(1)
  const perPage = ref(10)
  const totalItems = ref(0)
  const lastPage = ref(1)

  const totalDoctors = computed(() => doctors.value.length)
  const activeDoctors = computed(() => doctors.value.filter(d => (d.status ? d.status === 'active' : d.is_active === 1)))
  const inactiveDoctors = computed(() => doctors.value.filter(d => (d.status ? d.status === 'inactive' : d.is_active === 0)))

  const fetchDoctors = async (page = 1) => {
    try {
      loading.value = true
      error.value = null
      const res = await api.get('/doctors', { params: { page } })
      const payload = res?.data || {}
      doctors.value = payload?.data || []
      const meta = payload?.meta || {}
      currentPage.value = Number(meta?.current_page) || page
      perPage.value = Number(meta?.per_page) || perPage.value
      totalItems.value = Number(meta?.total) || (Array.isArray(payload?.data) ? payload.data.length : 0)
      lastPage.value = Number(meta?.last_page) || lastPage.value
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to fetch doctors'
      notify('error', error.value || 'Failed to fetch doctors', t('doctors.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchDoctorById = async (doctorId: string | number): Promise<Doctor> => {
    try {
      loading.value = true
      error.value = null
      const res = await api.get(`/doctors/${doctorId}`)
      return res?.data?.data || res?.data
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to fetch doctor'
      notify('error', error.value || 'Failed to fetch doctor', t('doctors.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteDoctor = async (doctorId: string | number) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/doctors/${doctorId}`)
      doctors.value = doctors.value.filter(d => d.id !== doctorId)
      notify('success', t('users.messages.success.userDeleted') as string || 'Doctor deleted successfully', t('doctors.title'))
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to delete doctor'
      notify('error', error.value || 'Failed to delete doctor', t('doctors.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const toggleDoctorStatus = async (
    doctorId: string | number,
    options?: { currentIsActive?: number; reasonToDeactivate?: string }
  ) => {
    try {
      loading.value = true
      error.value = null

      // Determine current status if not provided
      let currentIsActive = options?.currentIsActive
      if (currentIsActive === undefined) {
        const fromStore = doctors.value.find(d => d.id === doctorId)
        if (fromStore?.is_active !== undefined) {
          currentIsActive = fromStore.is_active
        } else {
          const one = await fetchDoctorById(doctorId)
          currentIsActive = one?.is_active
        }
      }

      // If currently active and we're deactivating, a reason is required
      // Backend convention: when active (1) -> deactivating requires reason_to_deactivate
      if (currentIsActive === 1 && !options?.reasonToDeactivate) {
        const msg = t('users.deactivation.reasonPlaceholder') as string || 'Deactivation reason is required'
        notify('error', msg, t('doctors.title'))
        throw new Error('Deactivation reason is required')
      }

      const payload: Record<string, any> = {}
      if (options?.reasonToDeactivate) payload.reason_to_deactivate = options.reasonToDeactivate

      const res = await api.post(`/doctors/${doctorId}/toggle`, payload)
      notify('success', res?.data?.message || 'Status changed successfully', t('doctors.title'))
      await fetchDoctors()
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to toggle doctor status'
      notify('error', error.value || 'Failed to toggle doctor status', t('doctors.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const getDoctorById = (doctorId: string | number) => doctors.value.find(d => d.id === doctorId)

  const verifyDoctor = async (doctorId: string | number) => {
    try {
      loading.value = true
      error.value = null
      const res = await api.put(`/doctors/${doctorId}/verify`)
      notify('success', res?.data?.message || 'Doctor verified successfully', t('doctors.title'))
      await fetchDoctors()
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to verify doctor'
      notify('error', error.value || 'Failed to verify doctor', t('doctors.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const rejectDoctor = async (doctorId: string | number, reason?: string) => {
    try {
      loading.value = true
      error.value = null
      const payload: Record<string, any> = {}
      if (reason) payload.reason = reason
      const res = await api.put(`/doctors/${doctorId}/reject`, payload)
      notify('success', res?.data?.message || 'Doctor rejected successfully', t('doctors.title'))
      await fetchDoctors()
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to reject doctor'
      notify('error', error.value || 'Failed to reject doctor', t('doctors.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const clearError = () => { error.value = null }
  const resetStore = () => { doctors.value = []; loading.value = false; error.value = null }

  return {
    doctors,
    loading,
    error,
    // server pagination exports
    currentPage,
    perPage,
    totalItems,
    lastPage,
    totalDoctors,
    activeDoctors,
    inactiveDoctors,
    fetchDoctors,
    fetchDoctorById,
    deleteDoctor,
    toggleDoctorStatus,
    verifyDoctor,
    rejectDoctor,
    getDoctorById,
    clearError,
    resetStore
  }
})


