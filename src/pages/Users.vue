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
            v-if="row.avatar" 
            :src="row.avatar" 
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

      <!-- Status Column -->
      <template #status="{ row }">
        <ClickableStatusTag
          :status="row.status"
          :status-options="statusOptions"
          :loading="userStore.loading"
          @status-change="() => toggleUserStatus(row.id)"
        />
      </template>

      <!-- Actions Column -->
      <template #actions="{ row }">
        <div class="flex gap-2">
          <el-button 
            type="primary" 
            size="small" 
            @click="openEditDialog(row)"
            :loading="userStore.loading"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="confirmDeleteUser(row)"
            :loading="userStore.loading"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
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
              :key="option.value"
              :label="option.label"
              :value="option.value"
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
      <!-- Custom Avatar Upload Field -->
      <template #avatar>
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="handleEditAvatarUpload"
          accept="image/png,image/jpeg"
        >
          <el-avatar 
            v-if="editFormData.avatarPreview || editingUser?.avatar" 
            :src="editFormData.avatarPreview || editingUser?.avatar" 
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
              :key="option.value"
              :label="option.label"
              :value="option.value"
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
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Edit, Delete, RefreshRight, Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import ClickableStatusTag from '@/components/ClickableStatusTag.vue'
import FormDialog from '@/components/FormDialog.vue'
import SearchInput from '@/components/SearchInput.vue'
import StatusFilter from '@/components/StatusFilter.vue'
import { useUserStore, type User, type UserFormData } from '@/stores/user'
import { useRolesStore } from '@/stores/roles'

// Store
const userStore = useUserStore()
const rolesStore = useRolesStore()
const { t } = useI18n()

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editingUser = ref<User | null>(null)

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
  status: undefined
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

// Role options from roles store
const roleOptions = computed(() => 
  rolesStore.activeRoles.map(role => ({
    label: role.name,
    value: role.id
  }))
)

// Country codes options
const countryCodes = [
  { label: '🇸🇦  (+966)', value: '+966' },
  { label: '🇪🇬  (+20)', value: '+20' },
  { label: '🇦🇪  (+971)', value: '+971' },
  { label: '🇰🇼  (+965)', value: '+965' },
  { label: '🇶🇦  (+974)', value: '+974' },
  { label: '🇧🇭  (+973)', value: '+973' },
  { label: '🇴🇲  (+968)', value: '+968' },
  { label: '🇯🇴  (+962)', value: '+962' },
  { label: '🇱🇧  (+961)', value: '+961' },
  { label: '🇸🇾  (+963)', value: '+963' },
  { label: '🇮🇶  (+964)', value: '+964' },
  { label: '🇾🇪  (+967)', value: '+967' },
  { label: '🇵🇸  (+970)', value: '+970' },
  { label: '🇺🇸  (+1)', value: '+1' },
  { label: '🇬🇧  (+44)', value: '+44' },
  { label: '🇫🇷  (+33)', value: '+33' },
  { label: '🇩🇪  (+49)', value: '+49' },
  { label: '🇮🇹  (+39)', value: '+39' },
  { label: '🇪🇸  (+34)', value: '+34' },
  { label: '🇨🇦  (+1)', value: '+1' },
  { label: '🇦🇺  (+61)', value: '+61' },
  { label: '🇯🇵  (+81)', value: '+81' },
  { label: '🇨🇳  (+86)', value: '+86' },
  { label: '🇮🇳  (+91)', value: '+91' },
  { label: '🇧🇷  (+55)', value: '+55' },
  { label: '🇷🇺  (+7)', value: '+7' },
  { label: '🇿🇦  (+27)', value: '+27' },
  { label: '🇳🇬  (+234)', value: '+234' },
  { label: '🇰🇪  (+254)', value: '+254' },
  { label: '🇲🇦  (+212)', value: '+212' },
  { label: '🇹🇳  (+216)', value: '+216' },
  { label: '🇩🇿  (+213)', value: '+213' },
  { label: '🇱🇾  (+218)', value: '+218' },
  { label: '🇸🇩  (+249)', value: '+249' },
  { label: '🇪🇹  (+251)', value: '+251' },
  { label: '🇹🇷  (+90)', value: '+90' },
  { label: '🇮🇷  (+98)', value: '+98' },
  { label: '🇵🇰  (+92)', value: '+92' },
  { label: '🇦🇫  (+93)', value: '+93' }
]

// Table columns configuration
const tableColumns = computed(() => [
  { prop: 'avatar', label: t('users.table.avatar'), width: '80', slot: 'avatar' },
  { prop: 'name', label: t('users.table.name'), width: '150' },
  { prop: 'email', label: t('users.table.email'), width: '200' },
  { prop: 'phone', label: t('users.table.phone'), width: '150', slot: 'phone' },
  { prop: 'role', label: t('users.table.role'), width: '100' },
  { prop: 'status', label: t('users.table.status'), width: '120', slot: 'status' },
  { prop: 'createdAt', label: t('users.table.createdAt'), width: '120' }
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
  },
  {
    prop: 'status',
    label: t('users.form.status'),
    type: 'select',
    options: statusOptions.value,
    placeholder: t('users.form.placeholders.status')
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
  },
  {
    prop: 'status',
    label: t('users.form.status'),
    type: 'select',
    options: statusOptions.value,
    placeholder: t('users.form.placeholders.status')
  }
])

// Validation functions
const validateName = (_rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error(t('users.validation.name.required')))
    return
  }
  
  if (value.length < 2) {
    callback(new Error(t('users.validation.name.minLength')))
    return
  }
  
  if (value.length > 100) {
    callback(new Error(t('users.validation.name.maxLength')))
    return
  }
  
  // Check if contains only letters and numbers
  if (!/^[a-zA-Z0-9\u0600-\u06FF\s]+$/.test(value)) {
    callback(new Error(t('users.validation.name.invalid')))
    return
  }
  
  callback()
}

const validateEmail = (_rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error(t('users.validation.email.required')))
    return
  }
  
  if (value.length > 100) {
    callback(new Error(t('users.validation.email.maxLength')))
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    callback(new Error(t('users.validation.email.invalid')))
    return
  }
  
  // Check email uniqueness
  const existingUser = userStore.users.find(user => 
    user.email.toLowerCase() === value.toLowerCase() && 
    user.id !== editingUser.value?.id
  )
  
  if (existingUser) {
    callback(new Error(t('users.validation.email.duplicate')))
    return
  }
  
  callback()
}

const validatePhoneNumber = (_rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error(t('users.validation.phone.required')))
    return
  }
  
  // Remove any non-digit characters
  const cleanPhone = value.replace(/\D/g, '')
  
  // Check if phone number is valid (7-15 digits)
  if (cleanPhone.length < 7 || cleanPhone.length > 15) {
    callback(new Error(t('users.validation.phone.invalid')))
    return
  }
  
  // Check if it contains only digits
  if (!/^\d+$/.test(cleanPhone)) {
    callback(new Error(t('users.validation.phone.invalid')))
    return
  }
  
  callback()
}

const checkPhoneUniqueness = async (_rule: any, value: string, callback: Function) => {
  if (!value) {
    callback()
    return
  }
  
  try {
    // Get the full phone number with country code
    const countryCode = addFormData.value.countryCode || editFormData.value.countryCode || '+966'
    const fullPhone = `${countryCode}${value.replace(/\D/g, '')}`
    
    // Check if phone already exists in the current users list
    const existingUser = userStore.users.find(user => {
      const userPhone = user.phone?.replace(/\D/g, '') || ''
      const userCountryCode = user.phone?.match(/^\+\d+/)?.[0] || ''
      const userFullPhone = userCountryCode + userPhone
      return userFullPhone === fullPhone && user.id !== editingUser.value?.id
    })
    
    if (existingUser) {
      callback(new Error(t('users.validation.phone.duplicate')))
      return
    }
    
    callback()
  } catch (error) {
    callback()
  }
}

const validatePassword = (_rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error(t('users.validation.password.required')))
    return
  }
  
  if (value.length < 8) {
    callback(new Error(t('users.validation.password.minLength')))
    return
  }
  
  if (value.length > 25) {
    callback(new Error(t('users.validation.password.maxLength')))
    return
  }
  
  // Check for uppercase, lowercase, number, and no spaces
  const hasUppercase = /[A-Z]/.test(value)
  const hasLowercase = /[a-z]/.test(value)
  const hasNumber = /\d/.test(value)
  const hasSpaces = /\s/.test(value)
  
  if (!hasUppercase || !hasLowercase || !hasNumber || hasSpaces) {
    callback(new Error(t('users.validation.password.pattern')))
    return
  }
  
  callback()
}

const validateConfirmPassword = (_rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error(t('users.validation.confirmPassword.required')))
    return
  }
  
  if (value !== addFormData.value.password) {
    callback(new Error(t('users.validation.confirmPassword.mismatch')))
    return
  }
  
  callback()
}

const validateRole = (_rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error(t('users.validation.role.required')))
    return
  }
  
  callback()
}

const validateStatus = (_rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error(t('users.validation.status.required')))
    return
  }
  
  callback()
}

// Form validation rules
const formRules = computed(() => ({
  name: [
    { validator: validateName, trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ],
  phone: [
    { validator: validatePhoneNumber, trigger: 'blur' },
    { validator: checkPhoneUniqueness, trigger: 'blur' }
  ],
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  role: [
    { validator: validateRole, trigger: 'change' }
  ],
  status: [
    { validator: validateStatus, trigger: 'change' }
  ]
}))

const editFormRules = computed(() => ({
  name: [
    { validator: validateName, trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ],
  phone: [
    { validator: validatePhoneNumber, trigger: 'blur' },
    { validator: checkPhoneUniqueness, trigger: 'blur' }
  ],
  role: [
    { validator: validateRole, trigger: 'change' }
  ],
  status: [
    { validator: validateStatus, trigger: 'change' }
  ]
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
  editingUser.value = user
  
  // Extract country code and phone number
  const phoneMatch = user.phone?.match(/^(\+\d+)(.*)$/)
  const countryCode = phoneMatch ? phoneMatch[1] : '+966'
  const phoneNumber = phoneMatch ? phoneMatch[2] : user.phone || ''
  
  editFormData.value = {
    name: user.name,
    email: user.email,
    phone: phoneNumber,
    countryCode: countryCode,
    role: user.role,
    status: user.status
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
    const userData: UserFormData = {
      name: formData.name,
      email: formData.email,
      phone: `${formData.countryCode}${formData.phone}`,
      password: formData.password,
      role: formData.role,
      status: formData.status
    }
    
    await userStore.addUser(userData)
    showAddDialog.value = false
    resetAddForm()
  } catch (error) {
    // Error handling is done in the store
  }
}

const handleEditUser = async (formData: Record<string, any>) => {
  if (!editingUser.value) return
  
  try {
    // Combine country code with phone number
    const userData: Partial<UserFormData> = {
      name: formData.name,
      email: formData.email,
      phone: `${formData.countryCode}${formData.phone}`,
      role: formData.role,
      status: formData.status
    }
    
    await userStore.updateUser(editingUser.value.id, userData)
    showEditDialog.value = false
    resetEditForm()
  } catch (error) {
    // Error handling is done in the store
  }
}

const toggleUserStatus = async (userId: string | number) => {
  try {
    await userStore.toggleUserStatus(userId)
  } catch (error) {
    // Error handling is done in the store
  }
}

const confirmDeleteUser = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      t('users.messages.deleteConfirm.message', { name: user.name }),
      t('users.messages.deleteConfirm.title'),
      {
        confirmButtonText: t('users.messages.deleteConfirm.confirmButton'),
        cancelButtonText: t('users.messages.deleteConfirm.cancelButton'),
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    await userStore.deleteUser(user.id)
  } catch (error) {
    if (error !== 'cancel') {
      // Error handling is done in the store
    }
  }
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
    status: undefined
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