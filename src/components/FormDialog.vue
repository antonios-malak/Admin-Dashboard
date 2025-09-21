<template>
  <el-dialog 
    v-model="visible" 
    :title="title" 
    :width="width"
    @close="handleClose"
  >
    <el-form 
      :model="modelValue" 
      :rules="rules" 
      ref="formRef"
      @submit.prevent="handleSubmit"
      label-width="120px"
    >
      <el-form-item 
        v-for="field in fields" 
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
        :required="field.required"
      >
        <!-- Input Field -->
        <el-input 
          v-if="field.type === 'input'" 
          v-model="modelValue[field.prop]"
          :type="field.inputType || 'text'"
          :placeholder="field.placeholder"
          v-bind="field.props"
        />
        
        <!-- Textarea Field -->
        <el-input 
          v-else-if="field.type === 'textarea'" 
          v-model="modelValue[field.prop]"
          type="textarea"
          :placeholder="field.placeholder"
          :rows="field.rows || 3"
          v-bind="field.props"
        />
        
        <!-- Select Field -->
        <el-select 
          v-else-if="field.type === 'select'" 
          v-model="modelValue[field.prop]"
          :placeholder="field.placeholder"
          filterable
          v-bind="field.props"
        >
          <el-option
            v-for="option in field.options"
            :key="getOptionValue(option)"
            :label="getOptionLabel(option)"
            :value="getOptionValue(option)"
          />
        </el-select>
        
        <!-- Number Field -->
        <el-input-number 
          v-else-if="field.type === 'number'" 
          v-model="modelValue[field.prop]"
          :min="field.min"
          :max="field.max"
          :step="field.step || 1"
          v-bind="field.props"
        />
        
        <!-- Switch Field -->
        <el-switch 
          v-else-if="field.type === 'switch'" 
          v-model="modelValue[field.prop]"
          v-bind="field.props"
        />
        
        <!-- Date Picker -->
        <el-date-picker 
          v-else-if="field.type === 'date'" 
          v-model="modelValue[field.prop]"
          :type="field.dateType || 'date'"
          :placeholder="field.placeholder"
          v-bind="field.props"
        />
        
        <!-- Custom Slot -->
        <slot 
          v-else-if="field.type === 'slot'" 
          :name="field.prop" 
          :field="field" 
          :value="modelValue[field.prop]"
          :update-value="(val: any) => modelValue[field.prop] = val"
        />
      </el-form-item>
      
      <!-- Additional slots for custom fields -->
      <slot name="additional-fields" :form="modelValue" />
    </el-form>
    
    <template #footer>
      <el-button @click="handleClose">{{ cancelText }}</el-button>
      <el-button 
        type="primary" 
        @click="handleSubmit" 
        :loading="loading"
      >
        {{ submitText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance } from 'element-plus'

const props = withDefaults(defineProps<{
  visible: boolean
  title: string
  modelValue: Record<string, any>
  fields: any[]
  rules?: Record<string, any>
  loading?: boolean
  width?: string
  submitText?: string
  cancelText?: string
}>(), {
  loading: false,
  width: '500px',
  submitText: 'Submit',
  cancelText: 'Cancel'
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:modelValue': [value: Record<string, any>]
  'submit': [formData: Record<string, any>]
  'close': []
}>()

const formRef = ref<FormInstance>()

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

function getOptionLabel(option: any) {
  if (typeof option === 'string' || typeof option === 'number') return option
  return option.label || option.name || option.title || option
}

function getOptionValue(option: any) {
  if (typeof option === 'string' || typeof option === 'number') return option
  return option.value || option.id || option.code || option
}

async function handleSubmit() {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', props.modelValue)
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

function handleClose() {
  emit('close')
  emit('update:visible', false)
}
</script>
