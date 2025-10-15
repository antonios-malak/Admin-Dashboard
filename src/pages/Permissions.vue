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
        v-if="canUpdate"
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
          <!-- Name Column enforce locale direction -->
          <template #name="{ row }">
            <span :dir="dir">{{ row.name }}</span>
          </template>
          <!-- Actions Column -->
          <template #action="{ row }">
            <el-button circle type="primary" plain size="small" @click="openDetails(row)">
              <el-icon><View /></el-icon>
            </el-button>
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

    <el-dialog v-model="showDetails" :title="selectedGroup.title" width="480px">
      <div class="space-y-2">
        <div v-for="item in selectedGroup.permissions" :key="item.id" class="py-1">
          {{ item.display_name }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Refresh, Loading, View } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import LocalPagination from '@/components/LocalPagination.vue'
import { usePermissionsStore } from '@/stores/permissions'
import { useAuthStore } from '@/stores/auth'

// Composables
const { t } = useI18n()
const permStore = usePermissionsStore()
const authStore = useAuthStore()
const permissions = computed(() => {
  // ensure unique groups by category when showing group rows only
  // We want one row per group; use first permission per group as representative
  const map = new Map<string, any>()
  permStore.permissions.forEach((p: any) => {
    if (!map.has(p.category)) {
      map.set(p.category, {
        id: p.id,
        name: permStore.groups[p.category]?.title || p.name,
        category: p.category
      })
    }
  })
  return Array.from(map.values())
})
const dir = computed(() => document.documentElement.getAttribute('dir') || 'ltr')
const loading = computed(() => permStore.loading)
const fetchPermissions = () => permStore.fetchPermissions()
const canUpdate = computed(() => authStore.hasPermission('permissions_update'))
const refreshPermissions = () => {
  if (!canUpdate.value) return
  return permStore.updatePermissions()
}

// Table columns configuration
const tableColumns = computed(() => [
  {
    prop: 'id',
    label: t('permissions.table.columns.id'),
    width: '80px'
  },
  {
    prop: 'name', // will show group title
    label: t('permissions.table.columns.name'),
    minWidth: '200px',
    slot: 'name'
  },
  {
    prop: 'action', // actions column now
    label: t('permissions.actions'),
    width: '180px',
    slot: 'action'
  }
])

// Modal state for details
const showDetails = ref(false)
const selectedGroup = computed(() => {
  return permStore.groups[activeCategory.value] || { title: '', permissions: [] }
})
const activeCategory = ref('')
const openDetails = (row: any) => {
  activeCategory.value = row.category
  showDetails.value = true
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
