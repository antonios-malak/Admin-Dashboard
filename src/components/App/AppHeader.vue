<template>
  <div class="flex justify-between items-center">
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
      
      <span class="font-semibold">Welcome Admin!</span>
    </div>
    
    <!-- <el-avatar>
      <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
      </svg>
    </el-avatar> -->
    <div class="flex justify-center gap-3">
       <div class="flex justify-end ">
          <el-select v-model="$i18n.locale" style="width: 100px;" size="small">
            <el-option label="English" value="en" />
            <el-option label="العربية" value="ar" />
          </el-select>
        </div>
        <div class="flex justify-end ">
          <el-select v-model="$i18n.locale" style="width: 100px;" size="small">
            <el-option label="English" value="en" />
            <el-option label="العربية" value="ar" />
          </el-select>
        </div>

    </div>
    
  </div>
</template>

<script setup lang="ts">
import { Menu } from '@element-plus/icons-vue'

interface Props {
  showMenuButton?: boolean
}

withDefaults(defineProps<Props>(), {
  showMenuButton: false
})

defineEmits<{
  toggleSidebar: []
}>()
</script>
