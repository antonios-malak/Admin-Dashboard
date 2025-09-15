import { defineStore } from 'pinia'
import api from '@/utils/api'
import { notify } from '@/utils/notify'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as any[],
    loading: false
  }),
  actions: {
    async fetchCategories() {
      try {
        this.loading = true
        const response = await api.get('/api/categories')
        this.categories = response.data
      } catch (error: any) {
        notify('error', 'Failed to fetch categories', 'Error')
        console.error('Categories error:', error)
      } finally {
        this.loading = false
      }
    },
    
    async createCategory(category: any) {
      try {
        const response = await api.post('/api/categories', category)
        this.categories.unshift(response.data)
        notify('success', 'Category created successfully', 'Success')
      } catch (error: any) {
        notify('error', 'Failed to create category', 'Error')
        console.error('Create category error:', error)
      }
    },
    
    async deleteCategory(id: number) {
      try {
        await api.delete(`/api/categories/${id}`)
        this.categories = this.categories.filter(c => c.id !== id)
        notify('success', 'Category deleted successfully', 'Success')
      } catch (error: any) {
        notify('error', 'Failed to delete category', 'Error')
        console.error('Delete category error:', error)
      }
    }
  }
})
