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
      <el-menu-item index="/" @click="handleLinkClick" class="sidebar-item">
        <span class="sidebar-item-text">{{
          $t("appSidebar.navigation.dashboard")
        }}</span>
      </el-menu-item>
      <el-menu-item
        index="/my-account"
        @click="handleLinkClick"
        class="sidebar-item"
      >
        <span class="sidebar-item-text">{{
          $t("appSidebar.navigation.myAccount")
        }}</span>
      </el-menu-item>
      <el-menu-item
        class="sidebar-item"
        index="/users"
        @click="handleLinkClick"
        ><span class="sidebar-item-text">{{ $t("appSidebar.navigation.users") }}</span></el-menu-item
      >
            <el-menu-item
              class="sidebar-item"
              index="/roles"
              @click="handleLinkClick"
              ><span class="sidebar-item-text">{{ $t("appSidebar.navigation.roles") }}</span></el-menu-item
            >
            <el-menu-item
              class="sidebar-item"
              index="/permissions"
              @click="handleLinkClick"
              ><span class="sidebar-item-text">{{ $t("appSidebar.navigation.permissions") }}</span></el-menu-item
            >
    </el-menu>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    "link-clicked": [];
  }>();

  const handleLinkClick = () => {
    emit("link-clicked");
  };
</script>

<style scoped>
  .sidebar-container {
    background: #fff;
    border-right: 1px solid #e5e7eb;
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
