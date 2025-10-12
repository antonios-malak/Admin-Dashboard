import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { notify } from '@/utils/notify'
import i18n from '@/i18n'

export interface ProfileRole {
  id: number
  name: string
  permissions: Array<Record<string, unknown>>
}

export interface ProfileData {
  id: number
  name: string
  email: string
  phone?: string
  image?: string
  is_active?: number
  last_login_at?: string
  login_count?: number
  reason_to_deactivate?: string | null
  locale?: string
  created_at?: string
  role?: ProfileRole
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<ProfileData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProfile = async (): Promise<ProfileData> => {
    try {
      loading.value = true
      error.value = null
      const res = await api.get('/profile')
      // API shape: { status, message, data }
      const data: ProfileData = res.data?.data || res.data
      profile.value = data
      const successMsg: string = res?.data?.message || i18n.global.t('myAccount.updateProfile.fetchSuccess')
      notify('success', successMsg, i18n.global.t('myAccount.title'))
      return data
    } catch (e: any) {
      const errMsg: string = e?.response?.data?.message || e?.message || 'Failed to fetch profile'
      error.value = errMsg
      notify('error', errMsg, i18n.global.t('myAccount.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (payload: {
    name?: string
    email?: string
    phone?: string
    image?: File | null
    password?: string
    password_confirmation?: string
    countryCode?: string
  }) => {
    try {
      loading.value = true
      error.value = null

      const form = new FormData()
      if (payload.name) form.append('name', payload.name)
      if (payload.email) form.append('email', payload.email)
      if (payload.phone) form.append('phone', payload.phone)
      if (payload.countryCode) form.append('country_code', payload.countryCode)
      if (payload.password) form.append('password', payload.password)
      if (payload.password_confirmation) form.append('password_confirmation', payload.password_confirmation)
      if (payload.image) form.append('image', payload.image)

      const res = await api.post('/profile?_method=PUT', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const data: ProfileData = res.data?.data || res.data
      profile.value = data
      const successMsg: string = res?.data?.message || i18n.global.t('myAccount.updateProfile.success')
      notify('success', successMsg, i18n.global.t('myAccount.title'))
      return data
    } catch (e: any) {
      const errMsg: string = e?.response?.data?.message || e?.message || 'Failed to update profile'
      error.value = errMsg
      notify('error', errMsg, i18n.global.t('myAccount.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  return { profile, loading, error, fetchProfile, updateProfile }
})


