<template>
  <el-dropdown @command="handleCommand" trigger="click" class="status-filter">
    <el-button type="primary" size="default">
      <span>{{ selectedLabel }}</span>
      <el-icon class="el-icon--right">
        <ArrowDown />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          :command="null"
          :class="{ 'is-active': selectedStatus === null }"
        >
          All Status
        </el-dropdown-item>
        <el-dropdown-item 
          v-for="status in props.options" 
          :key="status.value"
          :command="status.value"
          :class="{ 'is-active': selectedStatus === status.value }"
        >
          <StatusTag :status="status.value" size="small" />
          <span class="ml-2">{{ status.label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import StatusTag from './StatusTag.vue'

interface StatusOption {
  value: string
  label: string
}

interface Props {
  modelValue?: string | null
  options?: StatusOption[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: () => [],
  placeholder: 'Filter by Status'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'change': [value: string | null]
}>()

const selectedStatus = computed({
  get: () => props.modelValue,
  set: (value: string | null) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const selectedLabel = computed(() => {
  if (!selectedStatus.value) {
    return props.placeholder
  }
  
  const selected = props.options.find(option => option.value === selectedStatus.value)
  return selected ? selected.label : selectedStatus.value
})

function handleCommand(command: string | null) {
  selectedStatus.value = command
}
</script>

<style scoped>
.status-filter {
  min-width: 150px;
}

.el-dropdown-menu__item.is-active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.el-dropdown-menu__item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
}
</style>