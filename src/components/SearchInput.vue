<!--
SearchInput - A simple reusable search component

Usage Examples:

1. Basic search:
<SearchInput 
  v-model="searchQuery" 
  placeholder="Search..." 
  @input="handleSearch" 
  @clear="handleClearSearch"
/>

2. With custom styling:
<SearchInput 
  v-model="searchQuery" 
  placeholder="Search products by name..." 
  size="large"
  @input="handleSearch" 
  @clear="handleClearSearch"
  class="max-w-md"
/>

Props:
- modelValue: The current search value
- placeholder: Input placeholder text
- size: Input size ('large' | 'default' | 'small')
- clearable: Show clear button (default: true)
- prefixIcon: Icon for input prefix

Events:
- update:modelValue: Emitted when input value changes
- input: Emitted immediately on input change
- clear: Emitted when clear button is clicked
-->

<template>
  <div class="search-input-container">
    <el-input
      v-model="searchValue"
      :placeholder="placeholder"
      :size="size"
      :clearable="clearable"
      :prefix-icon="prefixIcon"
      class="search-input"
      @input="handleInput"
      @clear="handleClear"
    >
     
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

interface Props {
  modelValue?: string
  placeholder?: string
  size?: 'large' | 'default' | 'small'
  clearable?: boolean
  prefixIcon?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Search...',
  size: 'default',
  clearable: true,
  prefixIcon: Search
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': [value: string]
  'clear': []
}>()

const searchValue = ref(props.modelValue)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue
})

// Watch for internal changes and emit
watch(searchValue, (newValue) => {
  emit('update:modelValue', newValue)
})

function handleInput(value: string) {
  emit('input', value)
}

function handleClear() {
  searchValue.value = ''
  emit('clear')
}
</script>

<style scoped>
.search-input-container {
  width: 100%;
  
}

.search-input {
  width: 100%;
    height: fit-content;


}
.search-input ::placeholder {
  color: #a2a9af;
  text-wrap: wrap;
}
</style>