<template>
  <el-tag :type="tagType" :size="size" :effect="effect">
    {{ displayText }}
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  status: string
  statusMap?: Record<string, string>
  size?: 'large' | 'default' | 'small'
  effect?: 'dark' | 'light' | 'plain'
}>(), {
  statusMap: () => ({}),
  size: 'default',
  effect: 'light'
})

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

const tagType = computed(() => {
  const status = props.status?.toLowerCase()
  return props.statusMap[status] || defaultStatusMap[status] || 'info'
})

const displayText = computed(() => {
  return props.status?.charAt(0).toUpperCase() + props.status?.slice(1) || 'Unknown'
})
</script>
