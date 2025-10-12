<template>
  <div class="p-6">
    <PageHeader 
      :title="$t('roles.title')" 
      :subtitle="$t('roles.subtitle')"
      show-add-button
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
      :data="filteredRoles"
      :columns="tableColumns"
      :loading="rolesStore.loading"
      :empty-message="$t('roles.table.emptyMessage')"
      :actions-min-width="220"
      :actions-label="$t('roles.table.availableOperations')"
    >
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
          :show-view="true"
          :show-edit="true"
          :show-delete="true"
          :show-status="false"
          @view="viewRole"
          @edit="openEditDialog"
          @delete="handleDelete"
        />
      </template>
    </DataTable>

    <!-- Add Role Dialog -->
    <FormDialog
      v-model:visible="showAddDialog"
      :title="$t('roles.form.addTitle')"
      :model-value="addFormData"
      :fields="addFormFields"
      :rules="formRules"
      :loading="rolesStore.loading"
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

// Store
const rolesStore = useRolesStore()
const permissionsStore = usePermissionsStore()
const { t } = useI18n()

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
  { prop: 'id', label: '#', width: '60' },
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

// Methods
const openAddDialog = () => {
  showAddDialog.value = true
}

const openEditDialog = (role: Role) => {
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

const mapRolePermissionNames = (perms: any[]): string[] => {
  if (!Array.isArray(perms)) return []
  return perms.map((p: any) => (typeof p === 'string' ? p : p?.name)).filter(Boolean)
}

const viewingRolePermissionNames = computed(() => {
  return viewingRole.value ? mapRolePermissionNames(viewingRole.value.permissions as any) : []
})

// Lifecycle
onMounted(() => {
  rolesStore.fetchRoles()
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
