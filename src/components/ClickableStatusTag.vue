<template>
  <el-dropdown 
    @command="handleStatusChange"
    trigger="click"
    placement="bottom-start"
  >
    <el-tag 
      :type="tagType" 
      :size="size" 
      :effect="effect"
      class="cursor-pointer hover:opacity-80 transition-opacity"
    >
      {{ displayText }}
      <el-icon class="ml-1">
        <ArrowDown />
      </el-icon>
    </el-tag>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="option in statusOptions" 
          :key="option.value"
          :command="option.value"
          :disabled="option.value === status"
        >
          <el-tag 
            :type="getTagType(option.value)" 
            size="small" 
            effect="light"
            class="mr-2"
          >
            {{ option.label }}
          </el-tag>
          {{ option.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

const props = withDefaults(defineProps<{
  status: string
  statusOptions: any[]
  statusMap?: Record<string, string>
  size?: 'large' | 'default' | 'small'
  effect?: 'dark' | 'light' | 'plain'
  loading?: boolean
}>(), {
  statusMap: () => ({}),
  size: 'default',
  effect: 'light',
  loading: false
})

const emit = defineEmits<{
  statusChange: [newStatus: string]
}>()

const defaultStatusMap: Record<string, string> = {
  // Success states
  'completed': 'success',
  'delivered': 'success',
  'resolved': 'success',
  'closed': 'success',
  'active': 'success',
  'available': 'success',
  'in stock': 'success',
  
  // Warning states
  'pending': 'warning',
  'processing': 'warning',
  'open': 'warning',
  'low stock': 'warning',
  
  // Danger states
  'cancelled': 'danger',
  'failed': 'danger',
  'urgent': 'danger',
  'critical': 'danger',
  'out of stock': 'danger',
  'inactive': 'danger',
  
  // Info states (default)
  'draft': 'info',
  'unknown': 'info'
}

const getTagType = (status: string) => {
  const statusLower = status?.toLowerCase()
  return props.statusMap[statusLower] || defaultStatusMap[statusLower] || 'info'
}

const tagType = computed(() => {
  return getTagType(props.status)
})

const displayText = computed(() => {
  return props.status?.charAt(0).toUpperCase() + props.status?.slice(1) || 'Unknown'
})

const handleStatusChange = (newStatus: string) => {
  if (newStatus !== props.status && !props.loading) {
    emit('statusChange', newStatus)
  }
}
</script>