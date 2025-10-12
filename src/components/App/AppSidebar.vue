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
      <!-- Dashboard -->
      <el-menu-item index="/" @click="handleLinkClick" class="sidebar-item">
        <span class="sidebar-item-text">{{
          $t("appSidebar.navigation.dashboard")
        }}</span>
      </el-menu-item>

      <!-- User Management -->
      <el-sub-menu index="user-management" class="sidebar-submenu">
        <template #title>
          <span class="sidebar-item-text">{{
            $t("appSidebar.navigation.userManagement")
          }}</span>
        </template>
        <el-menu-item
          class="sidebar-item"
          index="/admins"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.users")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/roles"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.roles")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/permissions"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.permissions")
          }}</span></el-menu-item
        >
      </el-sub-menu>

      <!-- Medical Management -->
      <el-sub-menu index="medical-management" class="sidebar-submenu">
        <template #title>
          <span class="sidebar-item-text">{{
            $t("appSidebar.navigation.medicalManagement")
          }}</span>
        </template>
        <el-menu-item
          class="sidebar-item"
          index="/doctors"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.doctors")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/specialities"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.specialities")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/follow-ups"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.followUps")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/exercises"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.exercises")
          }}</span></el-menu-item
        >
      </el-sub-menu>

      <!-- Content Management -->
      <el-sub-menu index="content-management" class="sidebar-submenu">
        <template #title>
          <span class="sidebar-item-text">{{
            $t("appSidebar.navigation.contentManagement")
          }}</span>
        </template>
        <el-menu-item
          class="sidebar-item"
          index="/community-posts"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.communityPosts")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/advertisements"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.advertisements")
          }}</span></el-menu-item
        >
      </el-sub-menu>

      <!-- App Content -->
      <el-sub-menu index="app-content" class="sidebar-submenu">
        <template #title>
          <span class="sidebar-item-text">{{
            $t("appSidebar.navigation.appContent")
          }}</span>
        </template>
        <el-menu-item
          class="sidebar-item"
          index="/about"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.about")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/terms"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.terms")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/privacy"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.privacy")
          }}</span></el-menu-item
        >
      </el-sub-menu>

      <!-- Settings -->
      <el-sub-menu index="settings" class="sidebar-submenu">
        <template #title>
          <span class="sidebar-item-text">{{
            $t("appSidebar.navigation.settings")
          }}</span>
        </template>
        <el-menu-item
          class="sidebar-item"
          index="/settings"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.settings")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/contact-us"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.contactUs")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/faqs"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.faqs")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/app-pages"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.appPages")
          }}</span></el-menu-item
        >
      </el-sub-menu>

      <!-- Locations Management -->
      <el-sub-menu index="locations-management" class="sidebar-submenu">
        <template #title>
          <span class="sidebar-item-text">{{
            $t("appSidebar.navigation.locationsManagement")
          }}</span>
        </template>
        <el-menu-item
          class="sidebar-item"
          index="/locations/countries"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.countries")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/locations/regions"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.regions")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/locations/cities"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.cities")
          }}</span></el-menu-item
        >
        <el-menu-item
          class="sidebar-item"
          index="/locations/districts"
          @click="handleLinkClick"
          ><span class="sidebar-item-text">{{
            $t("appSidebar.navigation.districts")
          }}</span></el-menu-item
        >
      </el-sub-menu>

      <!-- Last 3 pages as requested -->
      <!-- Auto Consultation -->
      <el-menu-item
        class="sidebar-item"
        index="/auto-consultation"
        @click="handleLinkClick"
        ><span class="sidebar-item-text">{{
          $t("appSidebar.navigation.autoConsultation")
        }}</span></el-menu-item
      >
      <!-- Winding-up Requests -->
      <el-menu-item
        class="sidebar-item"
        index="/filter-requests"
        @click="handleLinkClick"
        ><span class="sidebar-item-text">{{
          $t("appSidebar.navigation.windingUpRequests")
        }}</span></el-menu-item
      >

      <!-- Emojis -->
      <el-menu-item
        class="sidebar-item"
        index="/emojis"
        @click="handleLinkClick"
        ><span class="sidebar-item-text">{{
          $t("appSidebar.navigation.emojis")
        }}</span></el-menu-item
      >
      <el-menu-item
        class="sidebar-item"
        index="/sliders"
        @click="handleLinkClick"
        ><span class="sidebar-item-text">{{
          $t("appSidebar.navigation.sliders")
        }}</span></el-menu-item
      >

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
        index="/notifications"
        @click="handleLinkClick"
        ><span class="sidebar-item-text">{{
          $t("appSidebar.navigation.notifications")
        }}</span></el-menu-item
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
