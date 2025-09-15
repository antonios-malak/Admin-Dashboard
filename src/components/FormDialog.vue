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
          :step="field.step"
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
          :filterable="field.filterable"
          v-bind="field.props"
        >
          <el-option
            v-for="option in field.options"
            :key="getOptionValue(option, field)"
            :label="getOptionLabel(option, field)"
            :value="getOptionValue(option, field)"
          />
        </el-select>
        
        <!-- Number Field -->
        <el-input-number 
          v-else-if="field.type === 'number'" 
          v-model="modelValue[field.prop]"
          :min="field.min"
          :max="field.max"
          :step="field.step || 1"
          :precision="field.precision"
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

interface FormField {
  prop: string
  label: string
  type: 'input' | 'textarea' | 'select' | 'number' | 'switch' | 'date' | 'slot'
  required?: boolean
  placeholder?: string
  inputType?: string
  step?: number | string
  rows?: number
  filterable?: boolean
  options?: any[]
  optionLabel?: string
  optionValue?: string
  min?: number
  max?: number
  precision?: number
  dateType?: string
  props?: any
}

interface Props {
  visible: boolean
  title: string
  modelValue: Record<string, any>
  fields: FormField[]
  rules?: Record<string, any>
  loading?: boolean
  width?: string
  submitText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
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

function getOptionLabel(option: any, field: FormField) {
  if (typeof option === 'string' || typeof option === 'number') return option
  return option[field.optionLabel || 'label'] || option.name || option.title
}

function getOptionValue(option: any, field: FormField) {
  if (typeof option === 'string' || typeof option === 'number') return option
  return option[field.optionValue || 'value'] || option.id || option.code
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
