<template>
  <div class="p-6">
    <PageHeader :title="$t('myAccount.title')" />
    
    <div class="max-w-2xl mx-auto">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center gap-3">
            <el-icon size="24" style="color: var(--primary)">
              <User />
            </el-icon>
            <h3 class="text-lg font-semibold">{{ $t('myAccount.profileInformation.title') }}</h3>
          </div>
        </template>
        
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold mb-2" style="color: var(--text-primary)">{{ $t('myAccount.profileInformation.fullName') }}</label>
              <el-input 
                v-model="userInfo.name" 
                readonly 
                style="border-radius: 8px; border: 1px solid #e5e7eb; transition: border-color 0.2s ease;"
                size="large"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold mb-2" style="color: var(--text-primary)">{{ $t('myAccount.profileInformation.emailAddress') }}</label>
              <el-input 
                v-model="userInfo.email" 
                readonly 
                style="border-radius: 8px; border: 1px solid #e5e7eb; transition: border-color 0.2s ease;"
                size="large"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold mb-2" style="color: var(--text-primary)">{{ $t('myAccount.profileInformation.role') }}</label>
              <el-input 
                v-model="userInfo.role" 
                readonly 
                style="border-radius: 8px; border: 1px solid #e5e7eb; transition: border-color 0.2s ease;"
                size="large"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold mb-2" style="color: var(--text-primary)">{{ $t('myAccount.profileInformation.memberSince') }}</label>
              <el-input 
                v-model="userInfo.createdAt" 
                readonly 
                style="border-radius: 8px; border: 1px solid #e5e7eb; transition: border-color 0.2s ease;"
                size="large"
              />
            </div>
          </div>
        </div>
      </el-card>

      <el-card>
        <template #header>
          <div class="flex items-center gap-3">
            <el-icon size="24" style="color: var(--secondary)">
              <Lock />
            </el-icon>
            <h3 class="text-lg font-semibold">{{ $t('myAccount.securitySettings.title') }}</h3>
          </div>
        </template>
        
        <div class="space-y-6">
          <div class="space-y-3">
            <label class="block text-sm font-semibold" style="color: var(--text-primary)">{{ $t('myAccount.securitySettings.changePassword.title') }}</label>
            <p class="text-sm leading-relaxed" style="color: var(--text-secondary)">{{ $t('myAccount.securitySettings.changePassword.description') }}</p>
            <el-button 
              type="primary" 
              @click="showChangePasswordDialog = true"
              :icon="Lock"
              size="large"
              class="mt-2"
            >
              {{ $t('myAccount.securitySettings.changePassword.button') }}
            </el-button>
          </div>
          
          <el-divider class="my-6" />
          
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-800">{{ $t('myAccount.securitySettings.accountStatus.title') }}</label>
            <div class="flex items-center gap-3">
              <el-tag type="success" size="large" class="px-4 py-2">
                <el-icon class="mr-2"><Check /></el-icon>
                {{ $t('myAccount.securitySettings.accountStatus.active') }}
              </el-tag>
              <span class="text-sm text-gray-600">{{ $t('myAccount.securitySettings.accountStatus.description') }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Change Password Dialog -->
    <el-dialog
      v-model="showChangePasswordDialog"
      :title="$t('myAccount.securitySettings.changePassword.dialogTitle')"
      width="450px"
      :close-on-click-modal="false"
      class="password-dialog"
    >
      <div class="mb-4">
        <p class="text-sm text-gray-600 leading-relaxed">
          {{ $t('myAccount.securitySettings.changePassword.dialogDescription') }}
        </p>
      </div>
      
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="140px"
        class="password-form"
      >
        <el-form-item :label="$t('myAccount.securitySettings.changePassword.currentPassword')" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            show-password
            :placeholder="$t('myAccount.securitySettings.changePassword.currentPasswordPlaceholder')"
            size="large"
          />
        </el-form-item>
        
        <el-form-item :label="$t('myAccount.securitySettings.changePassword.newPassword')" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            :placeholder="$t('myAccount.securitySettings.changePassword.newPasswordPlaceholder')"
            size="large"
          />
        </el-form-item>
        
        <el-form-item :label="$t('myAccount.securitySettings.changePassword.confirmPassword')" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            :placeholder="$t('myAccount.securitySettings.changePassword.confirmPasswordPlaceholder')"
            size="large"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="flex justify-end gap-3 pt-4">
          <el-button 
            @click="showChangePasswordDialog = false"
            size="large"
          >
            {{ $t('myAccount.securitySettings.changePassword.cancel') }}
          </el-button>
          <el-button 
            type="primary" 
            @click="handleChangePassword"
            :loading="changingPassword"
            size="large"
          >
            {{ $t('myAccount.securitySettings.changePassword.updatePassword') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { User, Lock, Check } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'

const authStore = useAuthStore()
const { t } = useI18n()
const showChangePasswordDialog = ref(false)
const changingPassword = ref(false)

// User information from store
const userInfo = computed(() => {
  const user = authStore.user
  return {
    name: user?.name || 'N/A',
    email: user?.email || 'N/A',
    role: user?.role || 'Admin',
    createdAt: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
  }
})

// Password change form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordFormRef = ref()

// Password validation rules
const passwordRules = computed(() => ({
  currentPassword: [
    { required: true, message: t('myAccount.securitySettings.validation.currentPasswordRequired'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: t('myAccount.securitySettings.validation.newPasswordRequired'), trigger: 'blur' },
    { min: 8, message: t('myAccount.securitySettings.validation.newPasswordMin'), trigger: 'blur' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      message: t('myAccount.securitySettings.validation.newPasswordPattern'), 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: t('myAccount.securitySettings.validation.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        callback(
          value === passwordForm.newPassword
            ? undefined
            : new Error(t('myAccount.securitySettings.validation.passwordsDoNotMatch'))
        )
      },
      trigger: 'blur'
    }
  ]
}))

// Handle password change
async function handleChangePassword() {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    changingPassword.value = true
    
    // Use changePassword action from auth store
    await authStore.changePassword({
      email: authStore.user?.email,
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword
    })
    showChangePasswordDialog.value = false
    
    // Reset form
    Object.assign(passwordForm, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
  } catch (error) {
    console.error('Password change failed:', error)
    // Error notification is handled by auth store
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  // Ensure user is logged in
  if (!authStore.isLoggedIn) {
    authStore.logout()
  }
})
</script>

<style scoped>
.el-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.el-card :deep(.el-card__header) {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
}

.el-card :deep(.el-card__body) {
  padding: 1.5rem;
}

/* Profile input styling */
.profile-input :deep(.el-input__wrapper) {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: none;
  padding: 12px 16px;
}

.profile-input :deep(.el-input__wrapper:hover) {
  border-color: #cbd5e1;
}

.profile-input :deep(.el-input__inner) {
  color: #374151;
  font-weight: 500;
}

/* Password dialog styling */
.password-dialog :deep(.el-dialog__header) {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.password-dialog :deep(.el-dialog__body) {
  padding: 1.5rem;
}

.password-dialog :deep(.el-dialog__footer) {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.password-form :deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
}

.password-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.password-form :deep(.el-input__wrapper:hover) {
  border-color: #9ca3af;
}

.password-form :deep(.el-input__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .el-card :deep(.el-card__header),
  .el-card :deep(.el-card__body) {
    padding: 1rem;
  }
  
  .password-dialog :deep(.el-dialog__header),
  .password-dialog :deep(.el-dialog__body),
  .password-dialog :deep(.el-dialog__footer) {
    padding: 1rem;
  }
}
</style>
