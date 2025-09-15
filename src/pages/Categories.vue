<template>
  <div class="p-6">
    <PageHeader 
      title="Categories" 
      :show-add-button="true"
      add-button-text="Add Category"
      @add="showAddForm = true"
    />
    
    <!-- Search Input -->
    <div class="mb-4">
      <SearchInput
        v-model="searchQuery"
        placeholder="Search categories by name..."
        @input="handleSearch"
        @clear="handleClearSearch"
        



        class="max-w-md"
      />
    </div>
    
    <LocalPagination :data="filteredCategories" :page-size="6" v-slot="{ paginatedData }">
      <DataTable
        :data="paginatedData"
        :columns="columns"
        :loading="store.loading"
        :show-actions="true"
        empty-message="No categories found"
      >
        <template #actions="{ row }">
          <el-button 
            type="danger" 
            size="small" 
            @click="handleDelete(row.id)"
          >
            Delete
          </el-button>
        </template>
      </DataTable>
    </LocalPagination>
    
    <!-- Add Category Dialog -->
    <FormDialog
      v-model:visible="showAddForm"
      v-model:model-value="form"
      title="Add Category"
      :fields="formFields"
      :rules="rules"
      :loading="submitting"
      width="400px"
      @submit="handleSubmit"
      @close="resetForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { ElMessageBox } from 'element-plus'

// Components
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import FormDialog from '@/components/FormDialog.vue'
import SearchInput from '@/components/SearchInput.vue'
import LocalPagination from '@/components/LocalPagination.vue'

const store = useCategoriesStore()
const showAddForm = ref(false)
const submitting = ref(false)
const searchQuery = ref('')

const form = reactive({
  name: '',
  description: ''
})

// Filtered categories based on search query
const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return store.categories
  }
  return store.categories.filter(category => 
    category.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})


const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name', minWidth: 120 },
  { prop: 'description', label: 'Description', minWidth: 200 }
]

const formFields = [
  {
    prop: 'name',
    label: 'Name',
    type: 'input' as const,
    required: true,
    placeholder: 'Enter category name'
  },
  {
    prop: 'description',
    label: 'Description',
    type: 'textarea' as const,
    placeholder: 'Enter category description',
    rows: 3
  }
]

const rules = {
  name: [{ required: true, message: 'Please input category name', trigger: 'blur' }]
}

onMounted(() => {
  store.fetchCategories()
})

async function handleSubmit(formData: any) {
  try {
    submitting.value = true
    
    await store.createCategory({
      name: formData.name,
      description: formData.description
    })
    
    showAddForm.value = false
    resetForm()
  } catch (error) {
    console.error('Form submission failed:', error)
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  Object.assign(form, {
    name: '',
    description: ''
  })
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete the category. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    await store.deleteCategory(id)
  } catch {
    // User cancelled
  }
}

function handleSearch(query: string) {
  searchQuery.value = query
}

function handleClearSearch() {
  searchQuery.value = ''
}
</script>
