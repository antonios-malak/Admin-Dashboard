<template>
  <div class="p-6">
    <PageHeader 
      title="Products" 
      :show-add-button="true"
      add-button-text="Add Product"
      @add="showAddForm = true"
    />
    
    <!-- Search Input -->
    <div class="mb-4 flex gap-4 items-center">
      <SearchInput
        v-model="searchQuery"
        placeholder="Search products by name..."
        @input="handleSearch"
        @clear="handleClearSearch"
        class="max-w-md"
      />
      <StatusFilter
        v-model="statusFilter"
        :options="statusOptions"
        @change="handleStatusFilter"
      />
    </div>
    
    <LocalPagination :data="filteredProducts" :page-size="6" v-slot="{ paginatedData }">
      <DataTable
        :data="paginatedData"
        :columns="columns"
        :loading="store.loading"
        :show-actions="true"
        empty-message="No products found"
      >
        <template #status="{ row }">
          <StatusTag :status="row.stock > 0 ? 'in stock' : 'out of stock'" />
        </template>
        <template #actions="{ row }">
          <el-button 
            type="danger" 
            size="small" 
            @click="handleDelete(row.id)"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </DataTable>
    </LocalPagination>
    
    <!-- Add Product Dialog -->
    <FormDialog
      v-model:visible="showAddForm"
      v-model:model-value="form"
      title="Add Product"
      :fields="formFields"
      :rules="rules"
      :loading="submitting"
      @submit="handleSubmit"
      @close="resetForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'
import { Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

// Components
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import FormDialog from '@/components/FormDialog.vue'
import StatusTag from '@/components/StatusTag.vue'
import SearchInput from '@/components/SearchInput.vue'
import LocalPagination from '@/components/LocalPagination.vue'
import StatusFilter from '@/components/StatusFilter.vue'

const store = useProductsStore()
const categoriesStore = useCategoriesStore()
const showAddForm = ref(false)
const submitting = ref(false)
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)

// Status options for products (based on stock status)
const statusOptions = [
  { value: 'in stock', label: 'In Stock' },
  { value: 'out of stock', label: 'Out of Stock' },
]

const form = reactive({
  name: '',
  price: '',
  stock: '',
  category: '',
})

// Filtered products based on search query and status filter
const filteredProducts = computed(() => {
  let filtered = store.products

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(product => {
      const productStatus = product.stock > 0 ? 'in stock' : 'out of stock'
      return productStatus === statusFilter.value
    })
  }

  return filtered
})


const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name', minWidth: 120 },
  { prop: 'price', label: 'Price', minWidth: 100, formatter: (row: any) => `$${row.price}` },
  { prop: 'stock', label: 'Stock', minWidth: 80 },
  { prop: 'category', label: 'Category', minWidth: 120 },
  { prop: 'status', label: 'Status', minWidth: 120, slot: 'status' }
]

const formFields = [
  {
    prop: 'name',
    label: 'Name',
    type: 'input' as const,
    required: true,
    placeholder: 'Enter product name'
  },
  {
    prop: 'price',
    label: 'Price',
    type: 'number' as const,
    required: true,
    min: 0,
    step: 1,
    precision: 2
  },
  {
    prop: 'stock',
    label: 'Stock',
    type: 'number' as const,
    required: true,
    min: 0
  },
  {
    prop: 'category',
    label: 'Category',
    type: 'select' as const,
    required: true,
    placeholder: 'Select category',
    filterable: true,
    options: categoriesStore.categories,
    optionLabel: 'name',
    optionValue: 'name'
  }
]

const rules = {
  name: [{ required: true, message: 'Please input product name', trigger: 'blur' }],
  price: [{ required: true, message: 'Please input price', trigger: 'blur' }],
  stock: [{ required: true, message: 'Please input stock', trigger: 'blur' }],
  category: [{ required: true, message: 'Please input category', trigger: 'blur' }],
}

onMounted(() => {
  store.fetchProducts()
  categoriesStore.fetchCategories()
})

async function handleSubmit(formData: any) {
  try {
    submitting.value = true
    
    await store.createProduct({
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      status: formData.status
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
    price: '',
    stock: '',
    category: '',
  })
}

async function handleDelete(id: number) {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete the product. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    await store.deleteProduct(id)
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

function handleStatusFilter(status: string | null) {
  statusFilter.value = status
}
</script>
