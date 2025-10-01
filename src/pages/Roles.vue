<template>
  <div class="p-6">
    <PageHeader 
      :title="$t('roles.title')" 
      :subtitle="$t('roles.subtitle')"
      show-add-button
      :add-button-text="$t('roles.addButton')"
      @add="openAddDialog"
    />
    
    <!-- Search and Filters -->
    <div class="mb-4 flex gap-4 items-center">
      <SearchInput 
        v-model="searchQuery"
        :placeholder="$t('roles.searchPlaceholder')"
        class="flex-1"
      />
      <StatusFilter 
        v-model="statusFilter"
        :options="statusOptions"
        :placeholder="$t('roles.filterPlaceholder')"
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
    >
      <!-- Status Column -->
      <template #status="{ row }">
        <ClickableStatusTag
          :status="row.status"
          :status-options="statusOptions"
          :loading="rolesStore.loading"
          @status-change="() => toggleRoleStatus(row)"
        />
      </template>

      <!-- Actions Column -->
      <template #actions="{ row }">
        <div class="flex gap-2">
          <el-button 
            type="info" 
            size="small" 
            @click="viewRole(row)"
            :loading="rolesStore.loading"
          >
            <el-icon><View /></el-icon>
          </el-button>
          <el-button 
            type="primary" 
            size="small" 
            @click="openEditDialog(row)"
            :loading="rolesStore.loading"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button 
            v-if="!row.isSystemRole"
            type="danger" 
            size="small" 
            @click="confirmDeleteRole(row)"
            :loading="rolesStore.loading"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
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
      <template #permissions="{ value, updateValue }">
        <el-select
          :model-value="value"
          @update:model-value="updateValue"
          multiple
          :placeholder="$t('roles.form.placeholders.permissions')"
          class="w-full"
        >
          <el-option
            v-for="permission in rolesStore.availablePermissions"
            :key="permission"
            :label="permission"
            :value="permission"
          />
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
      <template #permissions="{ value, updateValue }">
        <el-select
          :model-value="value"
          @update:model-value="updateValue"
          multiple
          :placeholder="$t('roles.form.placeholders.permissions')"
          class="w-full"
        >
          <el-option
            v-for="permission in rolesStore.availablePermissions"
            :key="permission"
            :label="permission"
            :value="permission"
          />
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
            {{ $t('roles.form.status') }}
          </label>
          <el-tag :type="viewingRole.status === 'active' ? 'success' : 'danger'">
            {{ $t(`roles.status.${viewingRole.status}`) }}
          </el-tag>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('roles.form.permissions') }}
          </label>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="permission in viewingRole.permissions"
              :key="permission"
              type="info"
            >
              {{ $t(`roles.permissions.${permission}`) }}
            </el-tag>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('roles.table.createdAt') }}
          </label>
          <p class="text-gray-900">{{ formatDate(viewingRole.createdAt) }}</p>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showViewDialog = false">
          {{ $t('roles.form.buttons.close') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Edit, Delete, RefreshRight, View } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import ClickableStatusTag from '@/components/ClickableStatusTag.vue'
import FormDialog from '@/components/FormDialog.vue'
import SearchInput from '@/components/SearchInput.vue'
import StatusFilter from '@/components/StatusFilter.vue'
import { useRolesStore, type Role, type RoleFormData } from '@/stores/roles'

// Store
const rolesStore = useRolesStore()
const { t } = useI18n()

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const editingRole = ref<Role | null>(null)
const viewingRole = ref<Role | null>(null)

// Form data
const addFormData = ref<RoleFormData>({
  name: '',
  permissions: [],
  status: undefined
})

const editFormData = ref<Partial<RoleFormData>>({})

// Status options
const statusOptions = computed(() => [
  { label: t('roles.status.active'), value: 'active' },
  { label: t('roles.status.inactive'), value: 'inactive' }
])

// Table columns configuration
const tableColumns = computed(() => [
  { prop: 'id', label: '#', width: '60' },
  { prop: 'name', label: t('roles.table.roleName'), width: '200' },
  { prop: 'status', label: t('roles.table.status'), width: '120', slot: 'status' },
  { prop: 'createdAt', label: t('roles.table.createdAt'), width: '150' },
  { prop: 'actions', label: t('roles.table.actions'), width: '200', slot: 'actions' }
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
    prop: 'permissions',
    label: t('roles.form.permissions'),
    type: 'slot',
    required: true
  },
  {
    prop: 'status',
    label: t('roles.form.status'),
    type: 'select',
    options: statusOptions.value,
    placeholder: t('roles.form.placeholders.status')
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
    prop: 'permissions',
    label: t('roles.form.permissions'),
    type: 'slot',
    required: true
  },
  {
    prop: 'status',
    label: t('roles.form.status'),
    type: 'select',
    options: statusOptions.value,
    placeholder: t('roles.form.placeholders.status')
  }
])

// Validation functions
const validateRoleName = (_rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error(t('roles.validation.name.required')))
    return
  }
  
  if (value.length < 2) {
    callback(new Error(t('roles.validation.name.minLength')))
    return
  }
  
  if (value.length > 100) {
    callback(new Error(t('roles.validation.name.maxLength')))
    return
  }
  
  // Check if contains only letters
  if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(value)) {
    callback(new Error(t('roles.validation.name.invalid')))
    return
  }
  
  // Check role name uniqueness
  const existingRole = rolesStore.roles.find(role => 
    role.name.toLowerCase() === value.toLowerCase() && 
    role.id !== editingRole.value?.id
  )
  
  if (existingRole) {
    callback(new Error(t('roles.validation.name.duplicate')))
    return
  }
  
  callback()
}

const validatePermissions = (_rule: any, value: string[], callback: Function) => {
  if (!value || value.length === 0) {
    callback(new Error(t('roles.validation.permissions.required')))
    return
  }
  
  callback()
}

// Form validation rules
const formRules = computed(() => ({
  name: [
    { validator: validateRoleName, trigger: 'blur' }
  ],
  permissions: [
    { validator: validatePermissions, trigger: 'blur' }
  ]
}))

const editFormRules = computed(() => ({
  name: [
    { validator: validateRoleName, trigger: 'blur' }
  ],
  permissions: [
    { validator: validatePermissions, trigger: 'change' }
  ]
}))

// Computed properties
const filteredRoles = computed(() => {
  let filtered = rolesStore.searchRoles(searchQuery.value)
  
  if (statusFilter.value) {
    filtered = rolesStore.filterRolesByStatus(statusFilter.value)
  }
  
  return filtered
})

const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' || statusFilter.value !== ''
})

// Methods
const openAddDialog = () => {
  showAddDialog.value = true
}

const openEditDialog = (role: Role) => {
  editingRole.value = role
  editFormData.value = {
    name: role.name,
    permissions: role.permissions,
    status: role.status
  }
  showEditDialog.value = true
}

const viewRole = (role: Role) => {
  viewingRole.value = role
  showViewDialog.value = true
}

const handleAddRole = async (formData: Record<string, any>) => {
  try {
    const roleData: RoleFormData = {
      name: formData.name,
      permissions: formData.permissions,
      status: formData.status
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
    const roleData: Partial<RoleFormData> = {
      name: formData.name,
      permissions: formData.permissions,
      status: formData.status
    }
    
    await rolesStore.updateRole(editingRole.value.id, roleData)
    showEditDialog.value = false
    resetEditForm()
  } catch (error) {
    // Error handling is done in the store
  }
}

const toggleRoleStatus = async (role: Role) => {
  try {
    if (role.isSystemRole) {
      // Special handling for system roles
      const message = role.status === 'active' 
        ? t('roles.messages.disableSystemRole.confirm')
        : t('roles.messages.enableRole.confirm')
      
      await ElMessageBox.confirm(
        message,
        t('roles.messages.disableSystemRole.title'),
        {
          confirmButtonText: t('roles.messages.disableSystemRole.confirmButton'),
          cancelButtonText: t('roles.messages.disableSystemRole.cancelButton'),
          type: 'warning'
        }
      )
    } else {
      // Regular role toggle
      const message = role.status === 'active' 
        ? t('roles.messages.disableRole.confirm')
        : t('roles.messages.enableRole.confirm')
      
      await ElMessageBox.confirm(
        message,
        t('roles.messages.disableRole.title'),
        {
          confirmButtonText: t('roles.messages.disableRole.confirmButton'),
          cancelButtonText: t('roles.messages.disableRole.cancelButton'),
          type: 'warning'
        }
      )
    }
    
    await rolesStore.toggleRoleStatus(role.id)
  } catch (error) {
    if (error !== 'cancel') {
      // Error handling is done in the store
    }
  }
}

const confirmDeleteRole = async (role: Role) => {
  try {
    await ElMessageBox.confirm(
      t('roles.messages.deleteConfirm.message', { name: role.name }),
      t('roles.messages.deleteConfirm.title'),
      {
        confirmButtonText: t('roles.messages.deleteConfirm.confirmButton'),
        cancelButtonText: t('roles.messages.deleteConfirm.cancelButton'),
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    await rolesStore.deleteRole(role.id)
  } catch (error) {
    if (error !== 'cancel') {
      // Error handling is done in the store
    }
  }
}

const resetAddForm = () => {
  addFormData.value = {
    name: '',
    permissions: [],
    status: undefined
  }
}

const resetEditForm = () => {
  editingRole.value = null
  editFormData.value = {}
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  rolesStore.fetchRoles()
})
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
