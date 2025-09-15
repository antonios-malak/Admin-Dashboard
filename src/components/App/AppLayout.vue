<template>
  <el-container class="min-h-screen w-[90%] mx-auto shadow-lg p-3 "> 
    <!-- Mobile overlay -->
    <div 
      v-if="sidebarOpen && isMobile" 
      class="fixed inset-0 bg-transparent bg-opacity-0 z-40 md:hidden"
      @click="closeSidebar"
    ></div>
    
    <!-- Sidebar -->
    <el-aside 
      :width="sidebarOpen || !isMobile ? '220px' : '0px'"
      :class="[
        'transition-all duration-300 ease-in-out overflow-hidden',
        'md:!w-[220px]', // Always show on md+ screens
        isMobile && sidebarOpen ? 'fixed left-3 top-3 bottom-3 z-50 bg-white rounded-lg shadow-xl' : '',
        isMobile ? 'md:relative md:left-auto md:top-auto md:bottom-auto' : ''
      ]"
    >
      <AppSidebar 
        v-if="sidebarOpen || !isMobile" 
        @link-clicked="handleSidebarLinkClick"
      />
    </el-aside>
    
    <el-container 
      :class="[
        'mt-3',
        isMobile && sidebarOpen ? 'ml-0' : '',
        !isMobile ? 'ml-0' : ''
      ]"
    >
      <el-header>
        <AppHeader :show-menu-button="isMobile" @toggle-sidebar="toggleSidebar" />
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const sidebarOpen = ref(false)
const windowWidth = ref(window.innerWidth)

// Check if screen is mobile (less than md breakpoint - 768px)
const isMobile = computed(() => windowWidth.value < 768)

// Update window width on resize
const handleResize = () => {
  windowWidth.value = window.innerWidth
  // Auto-close sidebar when switching to desktop
  if (!isMobile.value) {
    sidebarOpen.value = false
  }
}

// Handle keyboard events
const handleKeydown = (event: KeyboardEvent) => {
  // Close sidebar with ESC key on mobile
  if (event.key === 'Escape' && isMobile.value && sidebarOpen.value) {
    closeSidebar()
  }
}

// Toggle sidebar visibility
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Close sidebar (used by overlay click)
const closeSidebar = () => {
  sidebarOpen.value = false
}

// Handle sidebar link clicks - close sidebar on mobile
const handleSidebarLinkClick = () => {
  if (isMobile.value) {
    // Small delay to allow route transition to start
    setTimeout(() => {
      closeSidebar()
    }, 100)
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeydown)
})
</script>
