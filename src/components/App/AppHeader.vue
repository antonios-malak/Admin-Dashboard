<template>
  <div class="app-header flex justify-between items-center">
    <div class="flex items-center gap-3">
      <!-- Hamburger Menu Button (only visible on mobile) -->
      <el-button 
        v-if="showMenuButton"
        type="text" 
        size="large"
        @click="$emit('toggleSidebar')"
        class="md:hidden"
      >
        <el-icon size="20">
          <Menu />
        </el-icon>
      </el-button>
      
    </div>
    
    <div class="flex justify-center gap-3">
      <!-- Language Selector -->
      <div class="flex justify-end">
        <el-select v-model="$i18n.locale" style="width: 100px;" size="small">
          <el-option :label="$t('appHeader.languages.english')" value="en" />
          <el-option :label="$t('appHeader.languages.arabic')" value="ar" />
        </el-select>
      </div>
      
      <!-- Notifications Component -->
      <Notifications />

      <!-- User Dropdown Menu -->
      <el-dropdown @command="handleCommand" trigger="click">
        <el-button type="text" class="flex items-center gap-2">
          <el-avatar :size="32" style="background-color: rgba(59, 130, 246, 0.1)">
            <el-icon size="18" >
              <User />
            </el-icon>
          </el-avatar>
          <el-icon style="color: var(--text-secondary)">
            <ArrowDown />
          </el-icon>
        </el-button>
        
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="account" class="flex items-center gap-2">
              <el-icon><User /></el-icon>
              {{ $t('appHeader.userMenu.myAccount') }}
            </el-dropdown-item>
            <el-dropdown-item 
              command="logout" 
              class="flex items-center gap-2" 
              style="color: #dc2626;"
            >
              <el-icon><SwitchButton /></el-icon>
              {{ $t('appHeader.userMenu.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { Menu, User, ArrowDown, SwitchButton } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Notifications from '@/components/Notifications.vue'

interface Props {
  showMenuButton?: boolean
}

withDefaults(defineProps<Props>(), {
  showMenuButton: false
})

defineEmits<{
  toggleSidebar: []
}>()

const authStore = useAuthStore()
const router = useRouter()

// Handle dropdown menu commands
function handleCommand(command: string) {
  switch (command) {
    case 'account':
      router.push('/my-account')
      break
    case 'logout':
      authStore.logout()
      break
  }
}
</script>

<style scoped>
.app-header {
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-bottom: 2px solid var(--primary);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  position: relative;
  z-index: 10;
}

.app-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  opacity: 0.3;
}
</style>

