<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="text-center py-4">
      <div class="mb-4">
        <el-icon size="48" class="text-orange-500">
          <Warning />
        </el-icon>
      </div>
      <p class="text-lg font-medium mb-2">{{ message }}</p>
      <p v-if="description" class="text-gray-600">{{ description }}</p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="handleCancel" :disabled="loading">
          {{ cancelText }}
        </el-button>
        <el-button 
          type="danger" 
          @click="handleConfirm" 
          :loading="loading"
        >
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Warning } from '@element-plus/icons-vue'

interface Props {
  modelValue: boolean
  title?: string
  message: string
  description?: string
  confirmText?: string
  cancelText?: string
  width?: string
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  width: '400px',
  loading: false
})

const emit = defineEmits<Emits>()

const visible = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  visible.value = newValue
})

watch(visible, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

const handleClose = () => {
  emit('cancel')
  visible.value = false
}
</script>
