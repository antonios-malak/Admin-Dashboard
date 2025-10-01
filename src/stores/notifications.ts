import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'
import { notify } from '@/utils/notify'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  userId?: string
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const lastChecked = ref<string | null>(null)

  // Computed properties
  const unreadCount = computed(() => 
    notifications.value.filter(notif => !notif.read).length
  )

  const unreadNotifications = computed(() => 
    notifications.value.filter(notif => !notif.read)
  )

  // Actions
  async function fetchNotifications() {
    try {
      loading.value = true
      const response = await api.get('/api/notifications')
      notifications.value = response.data || []
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error)
      notify('error', 'Failed to load notifications', 'Error')
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`)
      
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error)
      notify('error', 'Failed to update notification', 'Error')
    }
  }

  async function markAllAsRead() {
    try {
      await api.patch('/api/notifications/mark-all-read')
      
      notifications.value.forEach(notification => {
        notification.read = true
      })
      
      notify('success', 'All notifications marked as read', 'Success')
    } catch (error: any) {
      console.error('Failed to mark all notifications as read:', error)
      notify('error', 'Failed to update notifications', 'Error')
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      await api.delete(`/api/notifications/${notificationId}`)
      
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index > -1) {
        notifications.value.splice(index, 1)
      }
      
      notify('success', 'Notification deleted', 'Success')
    } catch (error: any) {
      console.error('Failed to delete notification:', error)
      notify('error', 'Failed to delete notification', 'Error')
    }
  }

  function addNotification(notification: Notification) {
    notifications.value.unshift(notification)
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    
    return date.toLocaleDateString()
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'success': return 'Check'
      case 'warning': return 'Warning'
      case 'error': return 'Close'
      default: return 'InfoFilled'
    }
  }

  function getNotificationColor(type: string) {
    switch (type) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  return {
    // State
    notifications,
    loading,
    lastChecked,
    
    // Computed
    unreadCount,
    unreadNotifications,
    
    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    formatDate,
    getNotificationIcon,
    getNotificationColor
  }
})
