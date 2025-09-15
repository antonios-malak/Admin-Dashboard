<template>
  <div class="p-6">
    <PageHeader title="Customers" />
    
    <!-- Search Input -->
    <div class="mb-4">
      <SearchInput
        v-model="searchQuery"
        placeholder="Search customers by name..."
        @input="handleSearch"
        @clear="handleClearSearch"
        class="max-w-md"
      />
    </div>
    
    <LocalPagination :data="filteredCustomers" :page-size="6" v-slot="{ paginatedData }">
      <DataTable
        :data="paginatedData"
        :columns="columns"
        :loading="loading"
        empty-message="No customers found"
      >
        <template #date="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </DataTable>
    </LocalPagination>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/utils/api'
import { notify } from '@/utils/notify'

// Components
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import SearchInput from '@/components/SearchInput.vue'
import LocalPagination from '@/components/LocalPagination.vue'

const customers = ref([])
const loading = ref(false)
const searchQuery = ref('')

// Filtered customers based on search query
const filteredCustomers = computed(() => {
  if (!searchQuery.value) {
    return customers.value
  }
  return customers.value.filter((customer: any) => 
    customer.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const columns = [
  { prop: 'id', label: 'ID', width: '80' },
  { prop: 'name', label: 'Name' },
  { prop: 'email', label: 'Email' },
  { prop: 'phone', label: 'Phone' },
]

onMounted(() => {
  fetchCustomers()
})

async function fetchCustomers() {
  try {
    loading.value = true
    const response = await api.get('/api/customers')
    customers.value = response.data
  } catch (error: any) {
    notify('error', 'Failed to fetch customers', 'Error')
    console.error('Customers error:', error)
  } finally {
    loading.value = false
  }
}

function formatDate(dateString: string) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

function handleSearch(query: string) {
  searchQuery.value = query
}

function handleClearSearch() {
  searchQuery.value = ''
}
</script>
