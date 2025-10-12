<template>
    <div class="p-6">
    <PageHeader 
      :title="$t('users.title')" 
      :subtitle="$t('users.subtitle')"
      show-add-button
      :add-button-text="$t('users.addButton')"
      @add="openAddDialog"
    />
    
    <!-- Search and Filters -->
    <div class="mb-4 flex gap-4 items-center">
      <SearchInput 
        v-model="searchQuery"
        :placeholder="$t('users.searchPlaceholder')"
        class="flex-1"
      />
      <StatusFilter 
        v-model="statusFilter"
        :options="statusOptions"
        :placeholder="$t('users.filterPlaceholder')"
      />
      <el-button 
        v-if="hasActiveFilters"
        type="default" 
        @click="clearFilters"
        :icon="RefreshRight"
      >
        {{ $t('users.clearFilters') }}
      </el-button>
    </div>

    <!-- Users Data Table -->
    <DataTable
      :data="filteredUsers"
      :columns="tableColumns"
      :loading="userStore.loading"
      :empty-message="$t('users.table.emptyMessage')"
    >
      <!-- Avatar Column -->
      <template #avatar="{ row }">
        <div class="flex items-center gap-2">
          <el-avatar 
            v-if="row.image || row.avatar" 
            :src="row.image || row.avatar" 
            :size="32"
            shape="circle"
          />
          <el-avatar 
            v-else 
            :size="32"
            shape="circle"
          >
            {{ row.name?.charAt(0)?.toUpperCase() }}
          </el-avatar>
        </div>
      </template>

      <!-- Phone Column -->
      <template #phone="{ row }">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">{{ row.phone }}</span>
        </div>
      </template>


      <!-- Actions Column -->
      <template #actions="{ row }">
        <ActionButtons
          :item="row"
          :show-edit="true"
          :show-delete="true"
          :show-status="true"
          edit-text=""
          delete-text=""
          status-disable-text=""
          status-enable-text=""
          @edit="openEditDialog"
          @delete="handleDelete"
          @toggleStatus="toggleUserStatus"
        />
      </template>
    </DataTable>

    <!-- Add User Dialog -->
    <FormDialog
      v-model:visible="showAddDialog"
      :title="$t('users.form.addTitle')"
      :model-value="addFormData"
      :fields="addFormFields"
      :rules="formRules"
      :loading="userStore.loading"
      @submit="handleAddUser"
      @close="resetAddForm"
    >
      <!-- Custom Avatar Upload Field -->
      <template #avatar>
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="handleAvatarUpload"
          accept="image/png,image/jpeg"
        >
          <el-avatar 
            v-if="addFormData.avatarPreview" 
            :src="addFormData.avatarPreview" 
            :size="80"
            shape="circle"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
        <div class="text-xs text-gray-500 mt-1 ms-2">
          {{ $t('users.messages.avatarUpload.fileTypeInfo') }}
        </div>
      </template>

      <!-- Custom Phone Field -->
      <template #phone="{ value, updateValue }">
        <div class="flex gap-2">
          <el-select
            :model-value="addFormData.countryCode"
            @update:model-value="(val: string) => addFormData.countryCode = val"
            :placeholder="$t('users.form.placeholders.country')"
            class="flex-1 basis-[175px]"
            filterable
          >
            <el-option
              v-for="option in countryCodes"
              :key="option.dial"
              :label="option.label"
              :value="option.dial"
            />
          </el-select>
          <el-input
            :model-value="value"
            @update:model-value="updateValue"
            :placeholder="$t('users.form.placeholders.phone')"
            maxlength="15"
            show-word-limit
          />
        </div>
      </template>

      <!-- Custom Password Field -->
      <template #password="{ value, updateValue }">
        <el-input
          :model-value="value"
          @update:model-value="updateValue"
          type="password"
          :placeholder="$t('users.form.placeholders.password')"
          maxlength="25"
          show-word-limit
          show-password
        />
      </template>

      <!-- Custom Confirm Password Field -->
      <template #confirmPassword="{ value, updateValue }">
        <el-input
          :model-value="value"
          @update:model-value="updateValue"
          type="password"
          :placeholder="$t('users.form.placeholders.confirmPassword')"
          maxlength="25"
          show-word-limit
          show-password
        />
      </template>

      <!-- Custom Role Field -->
      <template #role="{ value, updateValue }">
        <el-select
          :model-value="value"
          @update:model-value="updateValue"
          :placeholder="$t('users.form.placeholders.role')"
          class="w-full"
        >
          <el-option
            v-for="option in roleOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </template>
    </FormDialog>

    <!-- Edit User Dialog -->
    <FormDialog
      v-model:visible="showEditDialog"
      :title="$t('users.form.editTitle')"
      :model-value="editFormData"
      :fields="editFormFields"
      :rules="editFormRules"
      :loading="userStore.loading"
      @submit="handleEditUser"
      @close="resetEditForm"
    >
      <!-- Custom Avat  ذar Upload Field -->
      <template #avatar>
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="handleEditAvatarUpload"
          accept="image/png,image/jpeg"
        >
          <el-avatar 
            v-if="editFormData.avatarPreview || editingUser?.image || editingUser?.avatar" 
            :src="editFormData.avatarPreview || editingUser?.image || editingUser?.avatar" 
            :size="80"
            shape="circle"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
        <div class="text-xs text-gray-500 mt-1">
          {{ $t('users.messages.avatarUpload.fileTypeInfo') }}
        </div>
      </template>

      <!-- Custom Phone Field -->
      <template #phone="{ value, updateValue }">
        <div class="flex gap-2">
          <el-select
            :model-value="editFormData.countryCode"
            @update:model-value="(val: string) => editFormData.countryCode = val"
            :placeholder="$t('users.form.placeholders.country')"
            class="w-10"
            filterable
          >
            <el-option
              v-for="option in countryCodes"
              :key="option.dial"
              :label="option.label"
              :value="option.dial"
            />
          </el-select>
          <el-input
            :model-value="value"
            @update:model-value="updateValue"
            :placeholder="$t('users.form.placeholders.phone')"
            maxlength="15"
            show-word-limit
          />
        </div>
      </template>

      <!-- Custom Role Field -->
      <template #role="{ value, updateValue }">
        <el-select
          :model-value="value"
          @update:model-value="updateValue"
          :placeholder="$t('users.form.placeholders.role')"
          class="w-full"
        >
          <el-option
            v-for="option in roleOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </template>
    </FormDialog>

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model="showConfirmModal"
      :title="confirmModalData?.title || ''"
      :message="confirmModalData?.message || ''"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- Deactivation Reason Modal -->
    <el-dialog
      v-model="showDeactivationModal"
      :title="t('users.deactivation.title')"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="deactivation-modal-content">
        <p class="mb-4">{{ t('users.deactivation.message', { name: userToDeactivate?.name }) }}</p>
        
        <el-form>
          <el-form-item :label="t('users.deactivation.reasonLabel')" required>
            <el-input
              v-model="deactivationReason"
              type="textarea"
              :rows="4"
              :placeholder="t('users.deactivation.reasonPlaceholder')"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDeactivationModal = false">
            {{ t('common.cancel') }}
          </el-button>
          <el-button 
            type="danger" 
            @click="handleDeactivation"
            :disabled="!deactivationReason.trim()"
          >
            {{ t('users.deactivation.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { RefreshRight, Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import FormDialog from '@/components/FormDialog.vue'
import SearchInput from '@/components/SearchInput.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import { createRules } from '@/utils/validation'
import { useUserStore, type User, type UserFormData } from '@/stores/user'
import { useRolesStore } from '@/stores/roles'
import { useCountriesStore } from '@/stores/countries'

// Store
const userStore = useUserStore()
const rolesStore = useRolesStore()
const countriesStore = useCountriesStore()
const { t } = useI18n()

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showConfirmModal = ref(false)
const confirmModalData = ref<{ title: string, message: string, action: () => void } | null>(null)
const editingUser = ref<User | null>(null)

// Deactivation reason modal
const showDeactivationModal = ref(false)
const deactivationReason = ref('')
const userToDeactivate = ref<User | null>(null)

// Form data
const addFormData = ref<UserFormData & { 
  countryCode: string
  avatar?: File | null
  avatarPreview?: string
  confirmPassword: string
}>({
  name: '',
  email: '',
  phone: '',
  countryCode: '+966',
  password: '',
  confirmPassword: '',
  avatar: null,
  avatarPreview: '',
  role: '',
})

const editFormData = ref<Partial<UserFormData & { 
  countryCode: string
  avatar?: File | null
  avatarPreview?: string
}>>({})

// Status options
const statusOptions = computed(() => [
  { label: t('users.status.active'), value: 'active' },
  { label: t('users.status.inactive'), value: 'inactive' }
])

// Role options from roles store (API roles have no status; show all)
const roleOptions = computed(() => 
  rolesStore.roles.map(role => ({
    label: role.name,
    value: role.id
  }))
)

// Country codes from store (label like EGY+20, dial like +20, iso, iso3)
const countryCodes = computed(() => countriesStore.options)

// Table columns configuration
const tableColumns = computed(() => [
  { prop: 'avatar', label: t('users.table.avatar'), width: '80', slot: 'avatar' },
  { prop: 'name', label: t('users.table.name'), width: '150' },
  { prop: 'email', label: t('users.table.email'), width: '200' },
  { prop: 'phone', label: t('users.table.phone'), width: '150', slot: 'phone' },
  { prop: 'role', label: t('users.table.role'), width: '100', formatter: (row: any) => row.role?.name || '' }
])

// Form fields configuration
const addFormFields = computed(() => [
  {
    prop: 'avatar',
    label: t('users.form.userImage'),
    type: 'slot'
  },
  {
    prop: 'name',
    label: t('users.form.fullName'),
    type: 'input',
    required: true,
    placeholder: t('users.form.placeholders.fullName'),
    maxlength: 100,
    showWordLimit: true
  },
  {
    prop: 'email',
    label: t('users.form.email'),
    type: 'input',
    inputType: 'email',
    required: true,
    placeholder: t('users.form.placeholders.email'),
    maxlength: 100,
    showWordLimit: true
  },
  {
    prop: 'phone',
    label: t('users.form.phone'),
    type: 'slot',
    required: true
  },
  {
    prop: 'password',
    label: t('users.form.password'),
    type: 'slot',
    required: true
  },
  {
    prop: 'confirmPassword',
    label: t('users.form.confirmPassword'),
    type: 'slot',
    required: true
  },
  {
    prop: 'role',
    label: t('users.form.role'),
    type: 'select',
    options: roleOptions.value,
    placeholder: t('users.form.placeholders.role')
  }
])

const editFormFields = computed(() => [
  {
    prop: 'avatar',
    label: t('users.form.userImage'),
    type: 'slot'
  },
  {
    prop: 'name',
    label: t('users.form.fullName'),
    type: 'input',
    required: true,
    placeholder: t('users.form.placeholders.fullName'),
    maxlength: 100,
    showWordLimit: true
  },
  {
    prop: 'email',
    label: t('users.form.email'),
    type: 'input',
    inputType: 'email',
    required: true,
    placeholder: t('users.form.placeholders.email'),
    maxlength: 100,
    showWordLimit: true
  },
  {
    prop: 'phone',
    label: t('users.form.phone'),
    type: 'slot',
    required: true
  },
  {
    prop: 'role',
    label: t('users.form.role'),
    type: 'select',
    options: roleOptions.value,
    placeholder: t('users.form.placeholders.role')
  }
])

// Form validation rules
const formRules = computed(() => ({
  name: createRules.name(),
  email: createRules.email(),
  phone: createRules.phone(),
  password: createRules.password(),
  confirmPassword: createRules.confirmPassword(() => addFormData.value.password || ''),
  role: createRules.role()
}))

const editFormRules = computed(() => ({
  name: createRules.name(),
  email: createRules.email(),
  phone: createRules.phone(),
  role: createRules.role()
}))

// Computed properties
const filteredUsers = computed(() => {
  let filtered = userStore.searchUsers(searchQuery.value)
  
  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
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

const openEditDialog = (user: User) => {
  console.log("userData" , user)
  editingUser.value = user
  
  // Extract country code and phone number using the same logic as MyAccount
  // This handles multiple phone number formats that might come from the API
  const raw = (user.phone || "").toString().trim();
  let countryCode = "+966"; // Default to Saudi Arabia
  let phoneNumber = "";
  
  if (raw) {
    // Get all available country codes from the store
    const codes = countryCodes.value.map((c) => c.dial); // with '+'
    
    // Case 1: Phone starts with +code (e.g., "+966512345678")
    const codeMatch = codes.find((c) => raw.startsWith(c));
    if (codeMatch) {
      countryCode = codeMatch;
      phoneNumber = raw.slice(codeMatch.length);
    } else {
      // Case 2: Phone starts with code digits without '+' (e.g., "966512345678")
      const codesNoPlus = codes.map((c) => c.replace("+", ""));
      const found = codesNoPlus.find((c) => raw.startsWith(c));
      if (found) {
        countryCode = `+${found}`;
        phoneNumber = raw.slice(found.length);
      } else {
        // Case 3: Pattern like ISO3+phone_code prefixed (e.g., "SAU+966512345678")
        const foundIso3 = countryCodes.value.find((c) =>
          raw.startsWith(`${c.iso3}+${c.dial.replace("+", "")}`)
        );
        if (foundIso3) {
          countryCode = foundIso3.dial;
          phoneNumber = raw.slice(
            (foundIso3.iso3 + "+" + foundIso3.dial.replace("+", "")).length
          );
        } else {
          // Fallback: keep default code and put all digits in phone
          countryCode = "+966";
          phoneNumber = raw;
        }
      }
    }
  }
  
  // Populate the edit form with extracted data
  editFormData.value = {
    name: user.name,
    email: user.email,
    phone: phoneNumber,
    countryCode: countryCode,
        role: user.role.name,
    avatar: null,
    avatarPreview: user.image || user.avatar || ''
    
  }
  showEditDialog.value = true
}

const handleAvatarUpload = (file: File) => {
  // Check file type
  const isImage = file.type === 'image/png' || file.type === 'image/jpeg'
  if (!isImage) {
    ElMessageBox.alert(t('users.messages.avatarUpload.fileTypeError'), t('users.messages.avatarUpload.fileTypeError'), {
      type: 'error'
    })
    return false
  }
  
  // Check file size (1MB = 1024 * 1024 bytes)
  const isLt1M = file.size / 1024 / 1024 < 1
  if (!isLt1M) {
    ElMessageBox.alert(t('users.messages.avatarUpload.fileSizeError'), t('users.messages.avatarUpload.fileSizeError'), {
      type: 'error'
    })
    return false
  }
  
  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    addFormData.value.avatarPreview = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  addFormData.value.avatar = file
  return false // Prevent auto upload
}

const handleEditAvatarUpload = (file: File) => {
  // Check file type
  const isImage = file.type === 'image/png' || file.type === 'image/jpeg'
  if (!isImage) {
    ElMessageBox.alert(t('users.messages.avatarUpload.fileTypeError'), t('users.messages.avatarUpload.fileTypeError'), {
      type: 'error'
    })
    return false
  }
  
  // Check file size (1MB = 1024 * 1024 bytes)
  const isLt1M = file.size / 1024 / 1024 < 1
  if (!isLt1M) {
    ElMessageBox.alert(t('users.messages.avatarUpload.fileSizeError'), t('users.messages.avatarUpload.fileSizeError'), {
      type: 'error'
    })
    return false
  }
  
  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    editFormData.value.avatarPreview = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  editFormData.value.avatar = file
  return false // Prevent auto upload
}

const handleAddUser = async (formData: Record<string, any>) => {
  try {
    // Combine country code with phone number
    const selectedCode = countryCodes.value.find(c => c.dial === formData.countryCode)
    const roleObj = rolesStore.roles.find(r => r.id === formData.role)
    
    // Create FormData for file upload
    const userFormData = new FormData()
    userFormData.append('name', formData.name)
    userFormData.append('email', formData.email)
    userFormData.append('phone', `${formData.countryCode}${formData.phone}`)
    userFormData.append('password', formData.password)
    userFormData.append('password_confirmation', formData.confirmPassword)
    
    if (selectedCode?.iso) {
      userFormData.append('country_code', selectedCode.iso)
    }
    
    if (roleObj?.name) {
      userFormData.append('role_name', roleObj.name)
    }
    
    if (addFormData.value.avatar) {
      userFormData.append('image', addFormData.value.avatar)
    }
    
    await userStore.addUser(userFormData)
    showAddDialog.value = false
    resetAddForm()
  } catch (error) {
    // Error handling is done in the store
  }
}

const handleEditUser = async (formData: Record<string, any>) => {
  if (!editingUser.value) return
  
  try {
    // Use editFormData.value as fallback if formData is missing values
    const name = formData.name || editFormData.value.name
    const email = formData.email || editFormData.value.email
    const phone = formData.phone || editFormData.value.phone
    const countryCode = formData.countryCode || editFormData.value.countryCode
    const role = formData.role || editFormData.value.role
    
    // Combine country code with phone number
    const selectedCode = countryCodes.value.find(c => c.dial === countryCode)
    const roleObj = rolesStore.roles.find(r => r.name === role)
    
    console.log('role from formData:', role)
    console.log('roleObj found:', roleObj)
    console.log('editingUser.role:', editingUser.value.role)
    
    // Create FormData for file upload
    const userFormData = new FormData()
    userFormData.append('name', name)
    userFormData.append('email', email)
    userFormData.append('phone', `${countryCode}${phone}`)
    
    if (selectedCode?.iso) {
      userFormData.append('country_code', selectedCode.iso)
    }
    
    if (roleObj?.name) {
      userFormData.append('role_name', roleObj.name)
    } else {
      // Fallback: use the role name from the original user data or formData
      userFormData.append('role_name', editingUser.value.role.name || role)
    }
    
    if (editFormData.value.avatar) {
      userFormData.append('image', editFormData.value.avatar)
    }
    
    await userStore.updateUser(editingUser.value.id, userFormData)
    showEditDialog.value = false
    resetEditForm()
  } catch (error) {
    // Error handling is done in the store
  }
}

const toggleUserStatus = async (user: User) => {
  try {
    // If user is active (is_active === 1) and we're trying to deactivate, show reason modal
    if (user.is_active === 1) {
      userToDeactivate.value = user
      deactivationReason.value = ''
      showDeactivationModal.value = true
      return
    }
    
    // If user is inactive (is_active === 0), activate directly without reason
    await userStore.toggleUserStatus(user.id)
  } catch (error) {
    // Error handling is done in the store
  }
}

// Handle deactivation with reason
const handleDeactivation = async () => {
  if (!userToDeactivate.value || !deactivationReason.value.trim()) {
    return
  }
  
  try {
    await userStore.toggleUserStatus(userToDeactivate.value.id, deactivationReason.value.trim())
    showDeactivationModal.value = false
    deactivationReason.value = ''
    userToDeactivate.value = null
  } catch (error) {
    // Error handling is done in the store
  }
}

const handleDelete = (user: User) => {
  confirmModalData.value = {
    title: t('users.messages.deleteConfirm.title'),
    message: t('users.messages.deleteConfirm.message', { name: user.name }),
    action: () => userStore.deleteUser(user.id)
  }
  showConfirmModal.value = true
}

const handleConfirm = () => {
  if (confirmModalData.value) {
    confirmModalData.value.action()
    showConfirmModal.value = false
    confirmModalData.value = null
  }
}

const handleCancel = () => {
  showConfirmModal.value = false
  confirmModalData.value = null
}

const resetAddForm = () => {
  addFormData.value = {
    name: '',
    email: '',
    phone: '',
    countryCode: '+966',
    password: '',
    confirmPassword: '',
    avatar: null,
    avatarPreview: '',
    role: '',
  }
}

const resetEditForm = () => {
  editingUser.value = null
  editFormData.value = {}
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

// Lifecycle
onMounted(() => {
  userStore.fetchUsers()
  rolesStore.fetchRoles()
  countriesStore.fetchCountries()
})
</script>

<style scoped>
.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border: 1px dashed var(--text-secondary);
  border-radius: 50%;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--text-secondary);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--primary);
}
</style>