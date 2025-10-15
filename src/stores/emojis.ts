import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import { notify } from '@/utils/notify'
import i18n from '@/i18n'

export interface EmojiItem {
  id: string | number
  symbol?: { en?: string; [k: string]: any }
  image?: string
  ['created-at']?: string
  [k: string]: any
}

const t = (key: string) => i18n.global.t(key)

export const useEmojisStore = defineStore('emojis', () => {
  const emojis = ref<EmojiItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination state
  const currentPage = ref(1)
  const perPage = ref(10)
  const totalItems = ref(0)
  const lastPage = ref(1)

  const fetchEmojis = async (page = 1) => {
    try {
      loading.value = true
      error.value = null
      const res = await api.get(`/emojis?page=${page}`)
      
      // Handle pagination response
      if (res?.data?.data) {
        emojis.value = res.data.data
        // Extract pagination metadata
        if (res.data.meta) {
          currentPage.value = res.data.meta.current_page || page
          perPage.value = res.data.meta.per_page || 10
          totalItems.value = res.data.meta.total || 0
          lastPage.value = res.data.meta.last_page || 1
        }
      } else {
        emojis.value = res?.data || []
      }
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to fetch emojis'
      notify('error', error.value || 'Failed to fetch emojis', t('emojis.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchEmojiById = async (id: string | number): Promise<EmojiItem> => {
    try {
      loading.value = true
      error.value = null
      const res = await api.get(`/emojis/${id}`)
      return res?.data?.data || res?.data
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to fetch emoji'
      notify('error', error.value || 'Failed to fetch emoji', t('emojis.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const addEmoji = async (payload: Record<string, any> | FormData) => {
    try {
      loading.value = true
      error.value = null
      const res = await api.post('/emojis', payload)
      const created = res?.data?.data || res?.data
      emojis.value.push(created)
      notify('success', res?.data?.message || 'Emoji added successfully', t('emojis.title'))
      return created
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to add emoji'
      notify('error', error.value || 'Failed to add emoji', t('emojis.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateEmoji = async (id: string | number, payload: Record<string, any> | FormData) => {
    try {
      loading.value = true
      error.value = null
      const res = await api.put(`/emojis/${id}`, payload)
      const updated = res?.data?.data || res?.data
      const idx = emojis.value.findIndex(e => e.id === id)
      if (idx !== -1) emojis.value[idx] = updated
      notify('success', res?.data?.message || 'Emoji updated successfully', t('emojis.title'))
      return updated
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to update emoji'
      notify('error', error.value || 'Failed to update emoji', t('emojis.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteEmoji = async (id: string | number) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/emojis/${id}`)
      emojis.value = emojis.value.filter(e => e.id !== id)
      notify('success', 'Emoji deleted successfully', t('emojis.title'))
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to delete emoji'
      notify('error', error.value || 'Failed to delete emoji', t('emojis.title'))
      throw e
    } finally {
      loading.value = false
    }
  }

  const resetStore = () => { 
    emojis.value = []
    loading.value = false
    error.value = null
    currentPage.value = 1
    perPage.value = 10
    totalItems.value = 0
    lastPage.value = 1
  }

  return {
    emojis,
    loading,
    error,
    currentPage,
    perPage,
    totalItems,
    lastPage,
    fetchEmojis,
    fetchEmojiById,
    addEmoji,
    updateEmoji,
    deleteEmoji,
    resetStore
  }
})


