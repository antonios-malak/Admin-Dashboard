<template>
  <div class="p-6">
    <PageHeader title="Notifications" />
    
    <div class="max-w-4xl mx-auto">
      <!-- Notifications Header -->
      <el-card class="mb-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold" style="color: var(--primary)">{{ notificationsStore.unreadCount }}</div>
              <div class="text-sm" style="color: var(--text-secondary)">Unread</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold" style="color: var(--text-secondary)">{{ notificationsStore.notifications.length }}</div>
              <div class="text-sm" style="color: var(--text-secondary)">Total</div>
            </div>
          </div>
          
          <div class="flex gap-2">
          
            <el-button 
              v-if="notificationsStore.unreadCount > 0"
              type="primary" 
              @click="notificationsStore.markAllAsRead"
              :loading="notificationsStore.loading"
            >
              Mark All Read
            </el-button>
            <el-button 
              @click="notificationsStore.fetchNotifications"
              :loading="notificationsStore.loading"
            >
              Refresh
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- Notifications List -->
      <el-card>
        <div v-if="notificationsStore.loading && notificationsStore.notifications.length === 0" class="text-center py-8">
          <el-icon class="is-loading" size="32"><Loading /></el-icon>
          <p class="mt-2" style="color: var(--text-secondary)">Loading notifications...</p>
        </div>
        
        <div v-else-if="notificationsStore.notifications.length === 0" class="text-center py-12">
          <el-icon size="48" style="color: #9ca3af">
            <Bell />
          </el-icon>
          <h3 class="text-lg font-semibold mt-4" style="color: var(--text-secondary)">No notifications</h3>
          <p class="mt-2" style="color: var(--text-secondary)">You're all caught up!</p>
        </div>
        
        <div v-else class="notifications-container">
          <div
            v-for="notification in notificationsStore.notifications"
            :key="notification.id"
            :class="[
              'notification-card',
              { 'unread': !notification.read }
            ]"
          >
            <div class="notification-content">
              <div class="notification-header">
                <div class="flex items-center gap-3">
                  <el-icon 
                    :class="notificationsStore.getNotificationColor(notification.type)"
                    size="20"
                  >
                    <component :is="notificationsStore.getNotificationIcon(notification.type)" />
                  </el-icon>
                  <div class="flex-1">
                    <h4 class="notification-title">{{ notification.title }}</h4>
                    <p class="notification-time">{{ notificationsStore.formatDate(notification.createdAt) }}</p>
                  </div>
                  <div class="notification-actions">
                    <el-button
                      v-if="!notification.read"
                      type="text"
                      size="small"
                      @click="markAsRead(notification)"
                    >
                      Mark as read
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="deleteNotification(notification)"
                      class="text-red-600"
                    >
                      Delete
                    </el-button>
                  </div>
                </div>
              </div>
              
              <div class="notification-body">
                <p class="notification-message">{{ notification.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Bell, Loading } from '@element-plus/icons-vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useAuthStore } from '@/stores/auth'
import PageHeader from '@/components/PageHeader.vue'
import type { Notification } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()
const authStore = useAuthStore()

// Mark notification as read
function markAsRead(notification: Notification) {
  notificationsStore.markAsRead(notification.id)
}

// Delete notification
function deleteNotification(notification: Notification) {
  notificationsStore.deleteNotification(notification.id)
}

// Fetch notifications on mount
onMounted(() => {
  if (authStore.isLoggedIn) {
    notificationsStore.fetchNotifications()
  }
})
</script>

<style scoped>
.notifications-container {
  max-height: 600px;
  overflow-y: auto;
}

.notification-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.notification-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.notification-card.unread {
  border-left: 4px solid #3b82f6;
  background-color: #eff6ff;
}

.notification-content {
  padding: 16px;
}

.notification-header {
  margin-bottom: 8px;
}

.notification-title {
  font-weight: 600;
  font-size: 16px;
  color: #374151;
  margin: 0;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
  margin: 4px 0 0 0;
}

.notification-body {
  margin-top: 8px;
}

.notification-message {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.notification-actions {
  display: flex;
  gap: 8px;
}

/* Custom scrollbar */
.notifications-container::-webkit-scrollbar {
  width: 6px;
}

.notifications-container::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.notifications-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.notifications-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
