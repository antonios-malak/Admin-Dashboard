import { defineStore } from 'pinia'
import api from '@/utils/api'
import { notify } from '@/utils/notify'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    languages: [] as any[],
    currencies: [] as any[],
    loading: false
  }),
  actions: {
    async fetchLanguages() {
      try {
        this.loading = true
        const response = await api.get('/api/languages')
        this.languages = response.data
      } catch (error: any) {
        notify('error', 'Failed to fetch languages', 'Error')
        console.error('Languages error:', error)
      } finally {
        this.loading = false
      }
    },
    
    async createLanguage(language: any) {
      try {
        const response = await api.post('/api/languages', language)
        this.languages.unshift(response.data)
        notify('success', 'Language created successfully', 'Success')
      } catch (error: any) {
        notify('error', 'Failed to create language', 'Error')
        console.error('Create language error:', error)
      }
    },

    async updateLanguage(id: number, language: any) {
      try {
        const response = await api.put(`/api/languages/${id}`, language)
        const index = this.languages.findIndex(l => l.id === id)
        if (index !== -1) {
          this.languages[index] = response.data
        }
        notify('success', 'Language updated successfully', 'Success')
      } catch (error: any) {
        notify('error', 'Failed to update language', 'Error')
        console.error('Update language error:', error)
      }
    },
    
    async deleteLanguage(id: number) {
      try {
        await api.delete(`/api/languages/${id}`)
        this.languages = this.languages.filter(l => l.id !== id)
        notify('success', 'Language deleted successfully', 'Success')
      } catch (error: any) {
        notify('error', 'Failed to delete language', 'Error')
        console.error('Delete language error:', error)
      }
    },
    
    async fetchCurrencies() {
      try {
        this.loading = true
        const response = await api.get('/api/currencies')
        this.currencies = response.data
      } catch (error: any) {
        notify('error', 'Failed to fetch currencies', 'Error')
        console.error('Currencies error:', error)
      } finally {
        this.loading = false
      }
    },
    
    async createCurrency(currency: any) {
      try {
        const response = await api.post('/api/currencies', currency)
        this.currencies.unshift(response.data)
        notify('success', 'Currency created successfully', 'Success')
      } catch (error: any) {
        notify('error', 'Failed to create currency', 'Error')
        console.error('Create currency error:', error)
      }
    },

    async updateCurrency(id: number, currency: any) {
      try {
        const response = await api.put(`/api/currencies/${id}`, currency)
        const index = this.currencies.findIndex(c => c.id === id)
        if (index !== -1) {
          this.currencies[index] = response.data
        }
        notify('success', 'Currency updated successfully', 'Success')
      } catch (error: any) {
        notify('error', 'Failed to update currency', 'Error')
        console.error('Update currency error:', error)
      }
    },
    
    async deleteCurrency(id: number) {
      try {
        await api.delete(`/api/currencies/${id}`)
        this.currencies = this.currencies.filter(c => c.id !== id)
        notify('success', 'Currency deleted successfully', 'Success')
      } catch (error: any) {
        notify('error', 'Failed to delete currency', 'Error')
        console.error('Delete currency error:', error)
      }
    }
  }
})
