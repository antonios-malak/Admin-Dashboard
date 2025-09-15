<!--
LocalPagination - A reusable pagination component for local data

Usage Example:
<LocalPagination
  :data="items"
  :page-size="6"
  v-slot="{ paginatedData, currentPage, totalPages }"
>
  <DataTable :data="paginatedData" :columns="columns" />
</LocalPagination>

Props:
- data: Array of items to paginate
- pageSize: Number of items per page (default: 6)
- currentPage: Current page number (v-model support)

Events:
- update:currentPage: Emitted when page changes

Slot Props:
- paginatedData: Current page's data
- currentPage: Current page number
- totalPages: Total number of pages
- totalItems: Total number of items
-->

<template>
  <div class="local-pagination">
    <!-- Slot for content -->
    <slot 
      :paginated-data="paginatedData"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalItems"
    />
    
    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalItems"
        layout="prev, pager, next"
        :hide-on-single-page="false"
        :small="true"
        background
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  data: any[]
  pageSize?: number
  currentPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 6,
  currentPage: 1
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const currentPage = ref(props.currentPage)

// Watch for external changes to currentPage prop
watch(() => props.currentPage, (newPage) => {
  if (newPage !== currentPage.value) {
    currentPage.value = newPage
  }
})

// Calculate total items and pages
const totalItems = computed(() => props.data.length)
const totalPages = computed(() => Math.ceil(totalItems.value / props.pageSize))

// Calculate paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.data.slice(start, end)
})

// Reset to page 1 when data changes
watch(() => props.data, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = 1
  }
}, { deep: true })

function handlePageChange(page: number) {
  currentPage.value = page
  emit('update:currentPage', page)
}
</script>

<style scoped>
.local-pagination {
  width: 100%;
}
</style>