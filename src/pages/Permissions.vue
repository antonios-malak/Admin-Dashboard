<template>
  <div class="permissions-page">
    <!-- Page Header -->
    <PageHeader
      :title="$t('permissions.title')"
      :subtitle="$t('permissions.subtitle')"
    />

    <!-- Refresh Button -->
    <div class="mb-4 flex justify-end">
      <el-button
        @click="refreshPermissions"
        :loading="loading"
        type="primary"
        :icon="Refresh"
      >
        {{ $t('permissions.refreshButton') }}
      </el-button>
    </div>

    <!-- Permissions Table with Local Pagination -->
    <LocalPagination
      :data="permissions"
      :page-size="10"
    >
      <template #default="{ paginatedData }">
        <DataTable
          :data="paginatedData"
          :columns="tableColumns"
          :loading="loading"
          :empty-message="$t('permissions.table.emptyMessage')"
        >
          <!-- Created At Slot -->
          <template #createdAt="{ row }">
            <span class="text-sm text-gray-500">
              {{ formatDate(row.createdAt) }}
            </span>
          </template>
        </DataTable>
      </template>
    </LocalPagination>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <el-icon class="is-loading" size="24">
        <Loading />
      </el-icon>
      <p class="mt-2 text-gray-500">{{ $t('permissions.loading') }}</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Refresh, Loading } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import LocalPagination from '@/components/LocalPagination.vue'
import { usePermissions} from '@/composables/usePermissions'

// Composables
const { t } = useI18n()
const { permissions, loading, fetchPermissions, refreshPermissions } = usePermissions()

// Table columns configuration
const tableColumns = computed(() => [
  {
    prop: 'id',
    label: t('permissions.table.columns.id'),
    width: '80px'
  },
  {
    prop: 'name',
    label: t('permissions.table.columns.name'),
    minWidth: '300px'
  },
  {
    prop: 'createdAt',
    label: t('permissions.table.columns.createdAt'),
    width: '150px'
  }
])

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchPermissions()
})
</script>

<style scoped>
.permissions-page {
  padding: 1rem;
}
</style>
