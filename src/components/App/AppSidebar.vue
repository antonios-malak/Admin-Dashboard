<template>
  <div class="sidebar-container">
    <!-- <div >
      <router-link to="/" class= " block text-center py-5">
        <img src="../../assets/imgs/logo.png" alt="Logo" class="inline h-8 w-6 mx-auto" />
      </router-link>
    </div> -->
    <el-menu 
      router 
      default-active="/" 
      class="sidebar-menu"
      :unique-opened="false"
    >
      <el-menu-item 
        index="/" 
        @click="handleLinkClick"
        class="sidebar-item"
      >
        <span class="sidebar-item-text">Dashboard</span>
      </el-menu-item>
      <el-menu-item 
        index="/products" 
        @click="handleLinkClick"
        class="sidebar-item"
      >
        <span class="sidebar-item-text">Products</span>
      </el-menu-item>
      <el-menu-item 
        index="/categories" 
        @click="handleLinkClick"
        class="sidebar-item"
      >
        <span class="sidebar-item-text">Categories</span>
      </el-menu-item>
      <el-menu-item 
        index="/customers" 
        @click="handleLinkClick"
        class="sidebar-item"
      >
        <span class="sidebar-item-text">Customers</span>
      </el-menu-item>
      <el-menu-item 
        index="/orders" 
        @click="handleLinkClick"
        class="sidebar-item"
      >
        <span class="sidebar-item-text">Orders</span>
      </el-menu-item>
      <el-menu-item 
        index="/reports" 
        @click="handleLinkClick"
        class="sidebar-item"
      >
        <span class="sidebar-item-text">Reports</span>
      </el-menu-item>
      <el-menu-item 
        index="/settings" 
        @click="handleLinkClick"
        class="sidebar-item"
      >
        <span class="sidebar-item-text">Settings</span>
      </el-menu-item>
    </el-menu>
    <div class="sidebar-footer">
      <el-button 
        type="danger" 
        size="default" 
        @click="logout"
        class="logout-button "
      >
        Logout
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const { logout } = useAuthStore()

const emit = defineEmits<{
  'link-clicked': []
}>()

const handleLinkClick = () => {
  emit('link-clicked')
}
</script>

<style scoped>
.sidebar-container {
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 210px;
}

.sidebar-menu {
  background: transparent !important;
  border: none !important;
  padding: 0.5rem 0.5rem 0 0.5rem;
  flex: 1 1 auto;
}

.sidebar-item {
  margin: 0.25rem 0 !important;
  border-radius: 8px !important;
  background: transparent !important;
  border: none !important;
  transition: background 0.2s, color 0.2s !important;
  color: #334155 !important;
}



.sidebar-item:hover {
  background: #e6f0fa !important;
  color: #409fff !important;
}



.sidebar-item.is-active {
  background: #409fff !important;
  color: #fff !important;
}

.sidebar-item.is-active .sidebar-item-text {
  color: #fff !important;
  font-weight: 600 !important;
}

.sidebar-item-text {
  color: inherit !important;
  font-weight: 500 !important;
  font-size: 0.97rem !important;
  letter-spacing: 0.02em !important;
  transition: color 0.2s !important;
}



.sidebar-footer {
  padding: 1rem;
  background: #f1f5f9;
  border-top: 1px solid #e2e8f0;
}

.logout-button {
  width: 100% !important;
  background: #fff !important;
  color: #409fff !important;
  border: 1px solid #e2e8f0 !important;
  font-weight: 600 !important;
  transition: background 0.2s, color 0.2s !important;
  
}

.logout-button:hover {
  background: #409fff !important;
  color: #fff !important;
}

/* Custom scrollbar */
.sidebar-container::-webkit-scrollbar {
  width: 6px;
}

.sidebar-container::-webkit-scrollbar-track {
  background: rgba(226, 232, 240, 0.3);
}

.sidebar-container::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.sidebar-container::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
