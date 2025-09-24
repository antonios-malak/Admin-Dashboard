<template>
  <div class="flex items-center justify-center h-screen">
    <el-card class="w-96">
      <template #header>
        <div class="flex justify-end">
          <el-select v-model="$i18n.locale" style="width: 100px;" size="small">
            <el-option label="English" value="en" />
            <el-option label="العربية" value="ar" />
          </el-select>
        </div>
      </template>
  <h2 class="mb-4 text-center font-bold">{{ $t('login.title') }}</h2>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="validationRules"
        @submit.prevent="submit"
      >
        <el-form-item prop="Email">
          <el-input v-model="formData.Email" :placeholder="$t('login.email')" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-if="!showPassword"
            v-model="formData.password"
            :placeholder="$t('login.password')"
            type="password"
            ref="passwordInputRef"
          >
            <template #suffix>
              <span
                @click="showPassword = true"
                style="cursor: pointer"
              >
                <el-icon><View /></el-icon>
              </span>
            </template>
          </el-input>
          <el-input
            v-else
            v-model="formData.password"
            :placeholder="$t('login.password')"
            type="text"
            ref="passwordInputRef"
          >
            <template #suffix>
              <span
                @click="showPassword = false"
                style="cursor: pointer"
              >
                <el-icon><Hide /></el-icon>
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submit"
            class="w-full"
            :loading="auth.loading"
            :disabled="!valid"
          >{{ $t('login.button') }}</el-button>
          
        </el-form-item>

        <div class="text-center">
          <router-link to="/forgot" class="text-blue-500 hover:underline">
            {{ $t('login.forgot') }}
          </router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from "vue";
  import type { FormInstance, FormRules } from "element-plus";
  import { useAuthStore } from "@/stores/auth";
  import { View, Hide } from "@element-plus/icons-vue";

  const formRef = ref<FormInstance>();
  const auth = useAuthStore();
  const showPassword = ref(false);
  // Ref for password input element
  const passwordInputRef = ref();

  // Function to toggle password visibility and restore cursor


  const formData = reactive({
    Email: "",
    password: "",
  });

  const validationRules = computed<FormRules>( () => ({
    Email: [
      { required: true, message: "Email is required", trigger: "blur" },
      {
        max: 100,
        message: "Email must be at most 100 characters",
        trigger: "blur",
      },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email format",
        trigger: "blur",
      },
    ],
    password: [
      { required: true, message: "Password is required", trigger: "blur" },
      {
        min: 8,
        message: "Password must be at least 8 characters",
        trigger: "blur",
      },
      {
        max: 25,
        message: "Password must be at most 25 characters",
        trigger: "blur",
      },
      {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        trigger: "blur",
      },
    ],
  })
)

  const valid = computed(() => {
    return (
      formData.Email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
      formData.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/) &&
      formData.password.length >= 8
    );
  });

  async function submit() {
    if (!formRef.value) return;

    await formRef.value.validate((valid) => {
      if (valid) {
        auth.login(formData.Email, formData.password);
      }
    });
  }
</script>
