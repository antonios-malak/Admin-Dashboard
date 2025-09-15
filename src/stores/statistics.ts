import { defineStore } from 'pinia'
import api from '@/utils/api'
import { notify } from '@/utils/notify'

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    stats: {} as any,
    loading: false
  }),
  actions: {
    async fetchStatistics() {
      try {
        this.loading = true
        const response = await api.get('/api/stats')
        this.stats = response.data
      } catch (error: any) {
        notify('error', 'Failed to fetch statistics', 'Error')
        console.error('Statistics error:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
