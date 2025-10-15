<template>
  <div class="p-6">
    <PageHeader 
      :title="$t('roles.title')" 
      :subtitle="$t('roles.subtitle')"
      :show-add-button="canAdd"
      :add-button-text="$t('roles.addButton')"
      @add="openAddDialog"
    />
    
    <!-- Search -->
    <div class="mb-4 flex gap-4 items-center">
      <SearchInput 
        v-model="searchQuery"
        :placeholder="$t('roles.searchPlaceholder')"
        class="flex-1"
      />
      <el-button 
        v-if="hasActiveFilters"
        type="default" 
        @click="clearFilters"
        :icon="RefreshRight"
      >
        {{ $t('roles.showAll') }}
      </el-button>
    </div>

    <!-- Roles Data Table -->
    <DataTable
      v-if="canShow"
      :data="filteredRoles"
      :columns="tableColumns"
      :loading="rolesStore.loading"
      :empty-message="$t('roles.table.emptyMessage')"
      :actions-min-width="240"
      :actions-label="$t('roles.table.availableOperations')"
    >
      <template #index="{ index }">
        <span>{{ baseIndex + index + 1 }}</span>
      </template>
      <template #permissions="{ row }">
        <div class="flex flex-wrap gap-2">
          <el-tag
            v-for="permission in mapRolePermissionNames(row.permissions).slice(0, 5)"
            :key="permission"
            type="info"
          >
            {{ permission }}
          </el-tag>
          <el-tag v-if="mapRolePermissionNames(row.permissions).length > 5" type="warning">
            +{{ mapRolePermissionNames(row.permissions).length - 5 }}
          </el-tag>
        </div>
      </template>
      <template #actions="{ row }">
        <ActionButtons
          :item="row"
          :show-view="canView"
          :show-edit="canEdit"
          :show-delete="canDelete"
          :show-status="false"
          :view-text="$t('common.actions.view')"
          :edit-text="$t('common.actions.edit')"
          :delete-text="$t('common.actions.delete')"
          @view="viewRole"
          @edit="openEditDialog"
          @delete="handleDelete"
        />
      </template>
    </DataTable>

    <!-- Server pagination controls -->
    <div class="mt-4 flex items-center justify-end gap-2" v-if="rolesStore.lastPage > 1">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="rolesStore.currentPage"
        :page-size="rolesStore.perPage"
        :total="rolesStore.totalItems"
        @current-change="handlePageChange"
      />
    </div>

    <!-- Add Role Dialog -->
    <FormDialog
      v-model:visible="showAddDialog"
      :title="$t('roles.form.addTitle')"
      :model-value="addFormData"
      :fields="addFormFields"
      :rules="formRules"
      :loading="rolesStore.loading"
      :submit-text="$t('roles.form.buttons.submit')"
      :cancel-text="$t('roles.form.buttons.cancel')"
      @submit="handleAddRole"
      @close="resetAddForm"
    >
      <!-- Custom Permissions Field -->
      <template #permission="{ value, updateValue }">
        <el-select
          :model-value="value"
          @update:model-value="updateValue"
          multiple
          :placeholder="$t('roles.form.placeholders.permissions')"
          class="w-full"
          filterable
        >
          <el-option-group
            v-for="(group, key) in permissionsStore.groups"
            :key="key"
            :label="group.title"
          >
            <el-option
              v-for="p in group.permissions"
              :key="p.name"
              :label="p.name"
              :value="p.name"
            />
          </el-option-group>
        </el-select>
      </template>
    </FormDialog>

    <!-- Edit Role Dialog -->
    <FormDialog
      v-model:visible="showEditDialog"
      :title="$t('roles.form.editTitle')"
      :model-value="editFormData"
      :fields="editFormFields"
      :rules="editFormRules"
      :loading="rolesStore.loading"
      :submit-text="$t('roles.form.buttons.submit')"
      :cancel-text="$t('roles.form.buttons.cancel')"
      @submit="handleEditRole"
      @close="resetEditForm"
    >
      <!-- Custom Permissions Field -->
      <template #permission="{ value, updateValue }">
        <el-select
          :model-value="value"
          @update:model-value="updateValue"
          multiple
          :placeholder="$t('roles.form.placeholders.permissions')"
          class="w-full"
          filterable
        >
          <el-option-group
            v-for="(group, key) in permissionsStore.groups"
            :key="key"
            :label="group.title"
          >
            <el-option
              v-for="p in group.permissions"
              :key="p.name"
              :label="p.name"
              :value="p.name"
            />
          </el-option-group>
        </el-select>
      </template>
    </FormDialog>

    <!-- View Role Dialog -->
    <el-dialog
      v-model="showViewDialog"
      :title="$t('roles.form.viewTitle')"
      width="600px"
    >
      <div v-if="viewingRole" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('roles.form.roleName') }}
          </label>
          <p class="text-gray-900">{{ viewingRole.name }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('roles.form.permissions') }}
          </label>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="permission in viewingRolePermissionNames"
              :key="permission"
              type="info"
            >
              {{ permission }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showViewDialog = false">
          {{ $t('roles.form.buttons.close') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model="showConfirmModal"
      :title="confirmModalData?.title || ''"
      :message="confirmModalData?.message || ''"
      :confirm-text="$t('users.form.buttons.delete')"
      :cancel-text="$t('users.form.buttons.cancel')"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import ActionButtons from '@/components/ActionButtons.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import FormDialog from '@/components/FormDialog.vue'
import SearchInput from '@/components/SearchInput.vue'
import { createRules } from '@/utils/validation'
import { useRolesStore, type Role, type RoleFormData } from '@/stores/roles'
import { usePermissionsStore } from '@/stores/permissions'
import { useAuthStore } from '@/stores/auth'

// Store
const rolesStore = useRolesStore()
const permissionsStore = usePermissionsStore()
const { t } = useI18n()
const authStore = useAuthStore()

// Reactive state
const searchQuery = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const showConfirmModal = ref(false)
const confirmModalData = ref<{ title: string, message: string, action: () => void } | null>(null)
const editingRole = ref<Role | null>(null)
const viewingRole = ref<Role | null>(null)

// Form data
const addFormData = ref<RoleFormData>({
  name: '',
  permission: []
})

const editFormData = ref<Partial<RoleFormData>>({})

// Table columns configuration
const tableColumns = computed(() => [
  { prop: 'index', label: '#', width: '60', slot: 'index' },
  { prop: 'name', label: t('roles.table.roleName'), width: '200' },
  { prop: 'permissions', label: t('roles.table.permissions'), minWidth: '300', slot: 'permissions' }
])

// Form fields configuration
const addFormFields = computed(() => [
  {
    prop: 'name',
    label: t('roles.form.roleName'),
    type: 'input',
    required: true,
    placeholder: t('roles.form.placeholders.roleName'),
    maxlength: 100,
    showWordLimit: true
  },
  {
    prop: 'permission',
    label: t('roles.form.permissions'),
    type: 'slot',
    required: true
  }
])

const editFormFields = computed(() => [
  {
    prop: 'name',
    label: t('roles.form.roleName'),
    type: 'input',
    required: true,
    placeholder: t('roles.form.placeholders.roleName'),
    maxlength: 100,
    showWordLimit: true
  },
  {
    prop: 'permission',
    label: t('roles.form.permissions'),
    type: 'slot',
    required: true
  }
])

// Form validation rules
const formRules = computed(() => ({
  name: createRules.roleName(),
  permission: createRules.permissions()
}))

const editFormRules = computed(() => ({
  name: createRules.roleName(),
  permission: createRules.permissions()
}))

// Computed properties
const filteredRoles = computed(() => {
  return rolesStore.searchRoles(searchQuery.value)
})

const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== ''
})

const baseIndex = computed(() => {
  const page = Number(rolesStore.currentPage) || 1
  const size = Number(rolesStore.perPage) || filteredRoles.value.length || 0
  return (page - 1) * size
})

// Permissions
const canShow = computed(() => authStore.hasPermission('roles_show'))
const canView = computed(() => authStore.hasPermission('roles_show'))
const canEdit = computed(() => authStore.hasPermission('roles_update'))
const canAdd = computed(() => authStore.hasPermission('roles_store'))
const canDelete = computed(() => authStore.hasPermission('roles_destroy'))

// Methods
const openAddDialog = () => {
  if (!canAdd.value) return
  showAddDialog.value = true
}

const openEditDialog = (role: Role) => {
  if (!canEdit.value) return
  editingRole.value = role
  const perms = Array.isArray(role.permissions)
    ? mapRolePermissionNames(role.permissions)
    : []
  editFormData.value = {
    name: role.name,
    permission: perms
  }
  showEditDialog.value = true
}

const viewRole = (role: Role) => {
  viewingRole.value = role
  showViewDialog.value = true
}

const handleDelete = (role: Role) => {
  if (!canDelete.value) return
  confirmModalData.value = {
    title: t('roles.messages.deleteConfirm.title') as string,
    message: t('roles.messages.deleteConfirm.message', { name: role.name }) as string,
    action: async () => {
      await rolesStore.deleteRole(role.id)
    }
  }
  showConfirmModal.value = true
}

const handleConfirm = async () => {
  if (confirmModalData.value) {
    await confirmModalData.value.action()
    showConfirmModal.value = false
    confirmModalData.value = null
  }
}

const handleCancel = () => {
  showConfirmModal.value = false
  confirmModalData.value = null
}

const handleAddRole = async (formData: Record<string, any>) => {
  try {
    const roleData: RoleFormData = {
      name: formData.name,
      permission: formData.permission
    }
    
    await rolesStore.addRole(roleData)
    showAddDialog.value = false
    resetAddForm()
  } catch (error) {
    // Error handling is done in the store
  }
}

const handleEditRole = async (formData: Record<string, any>) => {
  if (!editingRole.value) return
  
  try {
    const roleData: Record<string, any> = {
      name: formData.name,
      permission: formData.permission
    }
    
    await rolesStore.updateRole(editingRole.value.id, roleData)
    showEditDialog.value = false
    resetEditForm()
  } catch (error) {
    // Error handling is done in the store
  }
}

const resetAddForm = () => {
  addFormData.value = {
    name: '',
    permission: []
  }
}

const resetEditForm = () => {
  editingRole.value = null
  editFormData.value = {}
}

const clearFilters = () => {
  searchQuery.value = ''
}

// Robust mapper to support multiple backend shapes
const mapRolePermissionNames = (perms: any): string[] => {
  const names: string[] = []

  const pushIfValid = (val: any) => {
    if (!val) return
    if (typeof val === 'string') {
      names.push(val)
      return
    }
    if (typeof val === 'object') {
      // Common fields
      const candidate = val.name || val.display_name || val.permission_name || val.slug
      if (typeof candidate === 'string') {
        names.push(candidate)
        return
      }
      // If nested object contains its own permissions array
      if (Array.isArray(val.permissions)) {
        val.permissions.forEach((p: any) => pushIfValid(p))
        return
      }
      // If grouped object: { groupKey: { title, permissions: [...] }, ... }
      const maybeGroups = Object.values(val as Record<string, any>)
      if (maybeGroups.some((g: any) => Array.isArray(g?.permissions))) {
        maybeGroups.forEach((g: any) => {
          if (Array.isArray(g?.permissions)) g.permissions.forEach((p: any) => pushIfValid(p))
        })
        return
      }
    }
  }

  const walk = (input: any) => {
    if (!input) return
    if (Array.isArray(input)) {
      input.forEach((item) => pushIfValid(item))
      return
    }
    if (typeof input === 'object') {
      // Some APIs return { permissions: [...] }
      if (Array.isArray(input.permissions)) {
        input.permissions.forEach((p: any) => pushIfValid(p))
        return
      }
      // Grouped object
      const values = Object.values(input)
      if (values.length && values.every((v: any) => typeof v === 'object')) {
        values.forEach((v: any) => walk(v))
        return
      }
    }
    // Fallback
    pushIfValid(input)
  }

  walk(perms)
  return names.filter(Boolean)
}

const viewingRolePermissionNames = computed(() => {
  return viewingRole.value ? mapRolePermissionNames(viewingRole.value.permissions as any) : []
})

function handlePageChange(page: number) {
  rolesStore.fetchRoles(page)
}

// Lifecycle
onMounted(() => {
  rolesStore.fetchRoles(rolesStore.currentPage)
})

defineExpose({
  openEditDialog,
  viewRole
})
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
