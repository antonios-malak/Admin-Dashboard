import { defineStore } from 'pinia'
import api from '@/utils/api'
import { notify } from '@/utils/notify'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as any[],
    loading: false
  }),
  actions: {
    async fetchOrders() {
      try {
        this.loading = true
        const response = await api.get('/api/orders')
        this.orders = response.data
      } catch (error: any) {
        notify('error', 'Failed to fetch orders', 'Error')
        console.error('Orders error:', error)
      } finally {
        this.loading = false
      }
    },
    async updateOrderStatus(orderId: number, newStatus: string) {
      try {
        this.loading = true
        await api.post(`/api/orders/${orderId}/status`, { status: newStatus })
        // Update the order status in the local state
        const orderIndex = this.orders.findIndex((order: any) => order.id === orderId)
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = newStatus
        }
        notify('success', 'Order status updated successfully', 'Success')
      } catch (error) {
        notify('error', 'Failed to update order status', 'Error')
        console.error('Failed to update order status:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
