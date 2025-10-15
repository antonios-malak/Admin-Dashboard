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
      <!-- Dashboard - Show First -->
      <template v-if="groupedMenu.dashboard">
        <el-menu-item 
          :index="groupedMenu.dashboard.route" 
          @click="handleLinkClick" 
          class="sidebar-item"
        >
          <span class="sidebar-item-text">{{
            $t(`appSidebar.navigation.${groupedMenu.dashboard.name}`)
          }}</span>
        </el-menu-item>
      </template>

      <!-- Grouped Items (Submenus) - Show After Dashboard -->
      <template v-for="(items, parentKey) in groupedMenu.groups" :key="parentKey">
        <el-sub-menu :index="parentKey" class="sidebar-submenu">
          <template #title>
            <span class="sidebar-item-text">{{
              $t(`appSidebar.navigation.${parentKey}`)
            }}</span>
          </template>
          <el-menu-item
            v-for="item in items"
            :key="item.route"
            class="sidebar-item"
            :index="item.route"
            @click="handleLinkClick"
          >
            <span class="sidebar-item-text">{{
              $t(`appSidebar.navigation.${item.name}`)
            }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>

      <!-- Standalone Items (Bags, Packages, etc.) - Show After Groups -->
      <template v-for="item in groupedMenu.standaloneItems" :key="item.route">
        <el-menu-item 
          :index="item.route" 
          @click="handleLinkClick" 
          class="sidebar-item"
        >
          <span class="sidebar-item-text">{{
            $t(`appSidebar.navigation.${item.name}`)
          }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { pagePermissions } from '@/utils/pagePermissions'

const emit = defineEmits<{
  "link-clicked": [];
}>();

const authStore = useAuthStore()

const handleLinkClick = () => {
  emit("link-clicked");
};

// Define menu items structure
const menuItems = [
  // Dashboard
  { route: '/', name: 'dashboard', type: 'item' },
  
  // User Management
  { route: '/admins', name: 'users', type: 'item', parent: 'userManagement' },
  { route: '/roles', name: 'roles', type: 'item', parent: 'userManagement' },
  { route: '/permissions', name: 'permissions', type: 'item', parent: 'userManagement' },
  
  // Medical Management
  { route: '/doctors', name: 'doctors', type: 'item', parent: 'medicalManagement' },
  { route: '/specialities', name: 'specialities', type: 'item', parent: 'medicalManagement' },
  { route: '/follow-ups', name: 'followUps', type: 'item', parent: 'medicalManagement' },
  { route: '/recovery-plans', name: 'recoveryPlans', type: 'item', parent: 'medicalManagement' },
  { route: '/exercises', name: 'exercises', type: 'item', parent: 'medicalManagement' },
  
  // Content Management
  { route: '/community-posts', name: 'communityPosts', type: 'item', parent: 'contentManagement' },
  { route: '/advertisements', name: 'advertisements', type: 'item', parent: 'contentManagement' },
  
  // Settings
  { route: '/settings', name: 'settings', type: 'item', parent: 'settingsManagement' },
  { route: '/app-settings', name: 'appSettings', type: 'item', parent: 'settingsManagement' },
  { route: '/contact-us', name: 'contactUs', type: 'item', parent: 'settingsManagement' },
  { route: '/faqs', name: 'faqs', type: 'item', parent: 'settingsManagement' },
  { route: '/app-pages', name: 'appPages', type: 'item', parent: 'settingsManagement' },
  
  // Locations Management
  { route: '/locations/countries', name: 'countries', type: 'item', parent: 'locationsManagement' },
  { route: '/locations/regions', name: 'regions', type: 'item', parent: 'locationsManagement' },
  { route: '/locations/cities', name: 'cities', type: 'item', parent: 'locationsManagement' },
  { route: '/locations/districts', name: 'districts', type: 'item', parent: 'locationsManagement' },
  
  // Main Pages (after Locations Management)
  { route: '/bags', name: 'bags', type: 'item' },
  { route: '/packages', name: 'packages', type: 'item' },
  { route: '/nationalities', name: 'nationalities', type: 'item' },
  
  // Last pages as requested
  { route: '/auto-consultation', name: 'autoConsultation', type: 'item' },
  { route: '/filter-requests', name: 'windingUpRequests', type: 'item' },
  { route: '/emojis', name: 'emojis', type: 'item' },
  
  
  // Personal pages
  { route: '/my-account', name: 'myAccount', type: 'item' },
  { route: '/notifications', name: 'notifications', type: 'item' },
]

// Filtered menu based on permissions
const filteredMenu = computed(() => {
  const filtered = menuItems.filter(item => {
    // Always show dashboard
    if (item.route === '/') {
      return true;
    }
    
    const perm = pagePermissions[item.route];
    return !perm || authStore.hasPermission(perm);
  });
  
  return filtered;
});

// Group filtered items by parent
const groupedMenu = computed(() => {
  const groups: Record<string, any[]> = {};
  const standaloneItems: any[] = [];
  
  filteredMenu.value.forEach(item => {
    if (item.route === '/') {
      // Dashboard will be handled separately
      return;
    } else if (item.parent) {
      if (!groups[item.parent]) {
        groups[item.parent] = [];
      }
      groups[item.parent].push(item);
    } else {
      standaloneItems.push(item);
    }
  });
  
  // Find dashboard item
  const dashboard = filteredMenu.value.find(item => item.route === '/');
  
  return { groups, standaloneItems, dashboard };
});
</script>

<style scoped>
  .sidebar-container {
    background: #fff;
    border-right: 1px solid #e5e7eb;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 280px;
    width: 280px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .sidebar-menu {
    background: transparent !important;
    border: none !important;
    padding: 0.5rem 0.5rem 0 0.5rem;
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100vh - 1rem);
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
    background: rgba(59, 130, 246, 0.1) !important;
    color: var(--primary) !important;
  }

  .sidebar-item.is-active {
    background: var(--primary) !important;
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

  /* Custom scrollbar */
  .sidebar-container::-webkit-scrollbar {
    width: 8px;
  }

  .sidebar-container::-webkit-scrollbar-track {
    background: rgba(226, 232, 240, 0.3);
    border-radius: 4px;
  }

  .sidebar-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  .sidebar-container::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .sidebar-container {
      min-width: 200px;
      width: 200px;
    }
  }

  /* Submenu styles */
  .sidebar-submenu {
    margin: 0.25rem 0 !important;
  }

  .sidebar-submenu .el-sub-menu__title {
    border-radius: 8px !important;
    background: transparent !important;
    border: none !important;
    transition: background 0.2s, color 0.2s !important;
    color: #334155 !important;
    font-weight: 500 !important;
    font-size: 0.97rem !important;
    letter-spacing: 0.02em !important;
    position: relative !important;
  }

  .sidebar-submenu .el-sub-menu__title:hover {
    background: rgba(59, 130, 246, 0.1) !important;
    color: var(--primary) !important;
  }

  .sidebar-submenu.is-opened .el-sub-menu__title {
    background: rgba(59, 130, 246, 0.1) !important;
    color: var(--primary) !important;
  }

  .sidebar-submenu .el-menu {
    background: transparent !important;
    padding-left: 1rem !important;
  }

  .sidebar-submenu .el-menu-item {
    margin: 0.125rem 0 !important;
    padding-left: 1rem !important;
  }
</style>
