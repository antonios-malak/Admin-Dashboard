import { defineStore } from 'pinia'
import api from '@/utils/api'
import { notify } from '@/utils/notify'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as any[],
    loading: false
  }),
  actions: {
    async fetchProducts() {
      try {
        this.loading = true
        const response = await api.get('/api/products')
        this.products = response.data
      } catch (error: any) {
        notify('error', 'Failed to fetch products', 'Error')
        console.error('Products error:', error)
      } finally {
        this.loading = false
      }
    },
    
    async createProduct(product: any) {
      try {
        const response = await api.post('/api/products', product)
        this.products.unshift(response.data)
        notify('success', 'Product created successfully', 'Success')
      } catch (error: any) {
        notify('error', 'Failed to create product', 'Error')
        console.error('Create product error:', error)
      }
    },
    
    async deleteProduct(id: number) {
      try {
        await api.delete(`/api/products/${id}`)
        this.products = this.products.filter(p => p.id !== id)
        notify('success', 'Product deleted successfully', 'Success')
      } catch (error: any) {
        notify('error', 'Failed to delete product', 'Error')
        console.error('Delete product error:', error)
      }
    }
  }
})
