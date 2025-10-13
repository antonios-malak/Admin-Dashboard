<template>
  <div class="flex gap-2 pr-2">
    <!-- View Button -->
    <el-button
      v-if="showView"
      type="info"
      size="small"
      :icon="View"
      @click="$emit('view', item)"
      :title="viewTitle"
    >
      {{ viewText }}
    </el-button>

    <!-- Edit Button -->
    <el-button
      v-if="showEdit"
      type="primary"
      size="small"
      :icon="Edit"
      @click="$emit('edit', item)"
      :title="editTitle"
    >
      {{ editText }}
    </el-button>

    <!-- Delete Button -->
    <el-button
      v-if="showDelete"
      type="danger"
      size="small"
      :icon="Delete"
      @click="$emit('delete', item)"
      :title="deleteTitle"
      :disabled="deleteDisabled"
    >
      {{ deleteText }}
    </el-button>

    <!-- Status Toggle Switch -->
    <el-switch
      v-if="showStatus"
      :model-value="item.is_active === 1"
      @change="handleStatusChange"
      :title="item.is_active === 1 ? statusDisableTitle : statusEnableTitle"
      active-color="#67C23A"
      inactive-color="#DCDFE6"
    />

    <!-- Custom Actions -->
    <slot :item="item" />
  </div>
</template>

<script setup lang="ts">
import { Edit, Delete, View } from '@element-plus/icons-vue'

interface Props {
  item: any
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showStatus?: boolean
  deleteDisabled?: boolean
  viewText?: string
  editText?: string
  deleteText?: string
  statusDisableText?: string
  statusEnableText?: string
  viewTitle?: string
  editTitle?: string
  deleteTitle?: string
  statusDisableTitle?: string
  statusEnableTitle?: string
}

interface Emits {
  (e: 'view', item: any): void
  (e: 'edit', item: any): void
  (e: 'delete', item: any): void
  (e: 'toggleStatus', item: any): void
}

const props = withDefaults(defineProps<Props>(), {
  showView: false,
  showEdit: true,
  showDelete: true,
  showStatus: false,
  deleteDisabled: false,
  viewText: 'View',
  editText: 'Edit',
  deleteText: 'Delete',
  statusDisableText: 'Disable',
  statusEnableText: 'Enable',
  viewTitle: 'View details',
  editTitle: 'Edit item',
  deleteTitle: 'Delete item',
  statusDisableTitle: 'Disable item',
  statusEnableTitle: 'Enable item'
})

const emit = defineEmits<Emits>()

const handleStatusChange = () => {
  emit('toggleStatus', props.item)
}
</script>
