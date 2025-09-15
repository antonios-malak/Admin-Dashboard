<template>
  <div class="flex items-center justify-center h-screen">
    <el-card class="w-96">
      <h2 class="mb-4 text-center font-bold">Welcome back</h2>
      <el-form ref="formRef" :model="formData" :rules="validationRules" @submit.prevent="submit">
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="Username" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" placeholder="Password" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" class="w-full" :loading="auth.loading" :disabled="!valid">Login now</el-button>
        </el-form-item>
        
        <!-- <div class="text-center">
          <span class="text-gray-600">Don't have an account? </span>
          <router-link to="/register" class="text-blue-500 hover:underline">
            Register here
          </router-link>
        </div> -->
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const formRef = ref<FormInstance>()
const auth = useAuthStore()

const formData = reactive({
  username: '',
  password: ''
})

const validationRules = reactive<FormRules>({
  username: [
    { required: true, message: 'Username is required', trigger: 'blur' },
    { min: 3, message: 'Username must be at least 3 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
})


const valid = computed(() => {
  return formData.username.length >= 3 && formData.password.length >= 6
})

async function submit() {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      auth.login(formData.username, formData.password)
    }
  })
}
</script>
