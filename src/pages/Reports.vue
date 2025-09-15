<template>
  <div class="p-6">
    <PageHeader title="Reports" />
    
    <!-- Search Input -->
    <div class="mb-4 flex gap-4 items-center">
      <SearchInput
        v-model="searchQuery"
        placeholder="Search reports by subject..."
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
    
    <LocalPagination :data="filteredReports" :page-size="6" v-slot="{ paginatedData }">
      <DataTable
        :data="paginatedData"
        :columns="columns"
        :loading="store.loading"
        empty-message="No reports found"
      >
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
import { onMounted, ref, computed } from 'vue'
import { useReportsStore } from '@/stores/reports'
import DataTable from '@/components/DataTable.vue'
import ClickableStatusTag from '@/components/ClickableStatusTag.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchInput from '@/components/SearchInput.vue'
import LocalPagination from '@/components/LocalPagination.vue'
import StatusFilter from '@/components/StatusFilter.vue'

const store = useReportsStore()
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)

// Status options for reports
const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'urgent', label: 'Urgent' }
]

// Filtered reports based on search query and status filter
const filteredReports = computed(() => {
  let filtered = store.reports

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter((report: any) => 
      report.subject?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter((report: any) => 
      report.status?.toLowerCase() === statusFilter.value?.toLowerCase()
    )
  }

  return filtered
})

// Define table columns
const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'customerId', label: 'Customer ID', width: 120 },
  { prop: 'subject', label: 'Subject', width: 200 },
  { prop: 'description', label: 'Description', showOverflowTooltip: true },
  { prop: 'status', label: 'Status', width: 120, slot: 'status' },
  { prop: 'date', label: 'Date', width: 150, slot: 'date' }
]

onMounted(() => {
  store.fetchReports()
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

async function handleStatusChange(reportId: number, newStatus: string) {
  try {
    await store.updateReportStatus(reportId, newStatus)
  } catch (error) {
    console.error('Failed to update report status:', error)
  }
}
</script>
