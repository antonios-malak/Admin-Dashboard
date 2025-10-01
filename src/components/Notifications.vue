<template>
  <!-- Notifications Dropdown -->
  <el-dropdown trigger="click" placement="bottom-end" @command="handleNotificationCommand">
    <el-badge 
      :value="notificationsStore.unreadCount" 
      :hidden="notificationsStore.unreadCount === 0"
      class="notification-badge"
    >
      <el-button 
        type="text" 
        class="flex items-center notification-button"
        :loading="notificationsStore.loading"
      >
        <el-icon size="20">
          <Bell />
        </el-icon>
      </el-button>
    </el-badge>
    
    <template #dropdown>
      <el-dropdown-menu class="notifications-dropdown">
        <div class="notifications-header">
          <span class="font-semibold">Notifications</span>
          <el-button 
            v-if="notificationsStore.unreadCount > 0"
            type="text" 
            size="small"
            @click="notificationsStore.markAllAsRead"
          >
            Mark all read
          </el-button>
        </div>
        
        <div v-if="notificationsStore.notifications.length === 0" class="no-notifications">
          <el-icon size="32" style="color: #9ca3af">
            <Bell />
          </el-icon>
          <p class="text-sm" style="color: var(--text-secondary)">No notifications</p>
        </div>
        
        <div v-else class="notifications-list">
          <el-dropdown-item
            v-for="notification in notificationsStore.notifications.slice(0, 5)"
            :key="notification.id"
            :class="[
              'notification-item',
              { 'unread': !notification.read }
            ]"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-content">
              <div class="notification-header">
                <el-icon 
                  :class="notificationsStore.getNotificationColor(notification.type)"
                  size="16"
                >
                  <component :is="notificationsStore.getNotificationIcon(notification.type)" />
                </el-icon>
                <span class="notification-title">{{ notification.title }}</span>
                <span class="notification-time">{{ notificationsStore.formatDate(notification.createdAt) }}</span>
              </div>
              <div class="notification-message">{{ notification.message }}</div>
            </div>
          </el-dropdown-item>
          
          <el-dropdown-item 
            v-if="notificationsStore.notifications.length > 5"
            divided 
            class="view-all-notifications"
            @click="goToNotifications"
          >
            View all notifications ({{ notificationsStore.notifications.length }})
          </el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useRouter } from 'vue-router'
import type { Notification } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()
const router = useRouter()

// Handle notification commands
function handleNotificationCommand(command: string) {
  // Handle any notification-specific commands if needed
  console.log('Notification command:', command)
}

// Handle notification click
function handleNotificationClick(notification: Notification) {
  if (!notification.read) {
    notificationsStore.markAsRead(notification.id)
  }
  
  // You can add navigation logic here based on notification type
  // For example, navigate to specific pages based on notification content
}

// Navigate to notifications page
function goToNotifications() {
  router.push('/notifications')
}
</script>

<style scoped>
.notification-badge {
  margin-right: 8px;
}

.notification-button {
  padding: 8px !important;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.notification-button:hover {
  background-color: #f3f4f6;
}

.notifications-dropdown {
  min-width: 350px;
  max-width: 400px;
  max-height: 500px;
  overflow-y: auto;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.no-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px 16px !important;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item.unread {
  background-color: #eff6ff;
  border-left: 3px solid #3b82f6;
}

.notification-content {
  width: 100%;
}

.notification-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  flex: 1;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
}

.notification-message {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin-top: 4px;
}

.view-all-notifications {
  text-align: center;
  font-weight: 500;
  color: #3b82f6;
  padding: 12px 16px !important;
}

.view-all-notifications:hover {
  background-color: #eff6ff;
}

/* Custom scrollbar for notifications */
.notifications-list::-webkit-scrollbar {
  width: 4px;
}

.notifications-list::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
