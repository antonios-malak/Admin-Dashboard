<template>
  <div class="flex justify-start items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <p v-if="subtitle" class="text-gray-600 mt-1">{{ subtitle }}</p>
    </div>
    
   
  </div>
   <div class="flex items-center justify-end mb-3">
      <slot name="actions">
        <el-button 
          v-if="showAddButton"
          type="primary" 
          @click="$emit('add')"
          :loading="addButtonLoading"
        >
          {{ addButtonText }}
          <el-icon v-if="addButtonIcon" :size="12">
            <component :is="addButtonIcon" />
          </el-icon>
        </el-button>
      </slot>
    </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

interface Props {
  title: string
  subtitle?: string
  showAddButton?: boolean
  addButtonText?: string
  addButtonIcon?: any
  addButtonLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  showAddButton: false,
  addButtonText: 'Add',
  addButtonIcon: Plus,
  addButtonLoading: false
})

defineEmits<{
  add: []
}>()
</script>
