<template>
  <div class="p-6">
    <PageHeader title="Orders" />
    
    <!-- Search Input -->
    <div class="mb-4 flex gap-4 items-center flex-wrap">
      <SearchInput
        v-model="searchQuery"
        placeholder="Search orders by customer name or customer phone..."
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
    
    <LocalPagination :data="filteredOrders" :page-size="6" v-slot="{ paginatedData }">
      <DataTable
        :data="paginatedData"
        :columns="columns"
        :loading="store.loading"
        empty-message="No orders found"
      >
      <template #products="{ row }">
        <div v-if="row.products && row.products.length > 0">
          <el-tag 
            v-for="product in row.products" 
            :key="product.id" 
            size="small" 
            class="mr-1 mb-1"
          >
            {{ product.name || `Product ${product.id}` }}
          </el-tag>
          <span v-if="row.products.length > 2" class="text-gray-500">
            +{{ row.products.length - 2 }} more
          </span>
        </div>
        <span v-else class="text-gray-500">No products</span>
      </template>
      
      <template #total="{ row }">
        ${{ row.total }}
      </template>
      
      <template #status="{ row }">
        <ClickableStatusTag 
          :status="row.status" 
          :status-options="statusOptions"
          :loading="store.loading"
          @status-change="(newStatus) => handleStatusChange(row.id, newStatus)"
        />
      </template>
      
      <template #date="{ row }">
        {{ formatDate(row.date) }}
      </template>
    </DataTable>
    </LocalPagination>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useOrdersStore } from '@/stores/orders'

// Components
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import ClickableStatusTag from '@/components/ClickableStatusTag.vue'
import SearchInput from '@/components/SearchInput.vue'
import LocalPagination from '@/components/LocalPagination.vue'
import StatusFilter from '@/components/StatusFilter.vue'

const store = useOrdersStore()
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)

// Status options for orders
const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
]

// Filtered orders based on search query and status filter
const filteredOrders = computed(() => {
  let filtered = store.orders

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter((order: any) => 
      order.customer?.name?.toLowerCase().includes(searchQuery.value) ||
      order.customer?.phone?.includes(searchQuery.value)
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter((order: any) => 
      order.status?.toLowerCase() === statusFilter.value?.toLowerCase()
    )
  }

  return filtered
})

const columns = [
  { prop: 'id', label: 'ID', width: '80' },
  { prop: 'customer.name', label: 'Customer Name', width: '120'  },
  { prop: 'customer.phone', label: 'Customer Phone', width: '120' },
  { prop: 'products', label: 'Products', minWidth: '200', slot: 'products' },
  { prop: 'total', label: 'Total', width: '100', slot: 'total' },
  { prop: 'status', label: 'Status', slot: 'status' },
  { prop: 'date', label: 'Date', width: '150', slot: 'date' }
]

onMounted(() => {
  store.fetchOrders()
})

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

function handleStatusFilter(status: string | null) {
  statusFilter.value = status
}

async function handleStatusChange(orderId: number, newStatus: string) {
  await store.updateOrderStatus(orderId, newStatus)
}
</script>
