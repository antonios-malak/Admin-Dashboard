<template>
  <div class="flex items-center justify-center h-screen">
    <el-card class="w-96">
      <template #header>
        <div class="flex justify-end">
          <el-select v-model="$i18n.locale" style="width: 100px" size="small">
            <el-option label="English" value="en" />
            <el-option label="العربية" value="ar" />
          </el-select>
        </div>
      </template>
      <h2 class="mb-4 text-center font-bold">{{ $t("login.title") }}</h2>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="validationRules"
        @submit.prevent="submit"
      >
        <el-form-item prop="email" class="pb-4">
          <el-input v-model="formData.email" :placeholder="$t('login.email')" />
        </el-form-item>
        <el-form-item prop="password" class="pb-4">
          <el-input
            v-model="formData.password"
            :placeholder="$t('login.password')"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submit"
            class="w-full"
            :loading="auth.loading"
            :disabled="!valid"
            >{{ $t("login.button") }}</el-button
          >
        </el-form-item>

        <div class="text-center">
          <router-link
            to="/forgot"
            style="color: var(--primary)"
            class="hover:underline"
          >
            {{ $t("login.forgot") }}
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
  import { useI18n } from "vue-i18n";
  import { createRules } from '@/utils/validation'

  const formRef = ref<FormInstance>();
  const auth = useAuthStore();
  const { t } = useI18n();

  const formData = reactive({
    email: "",
    password: "",
  });

  const validationRules = computed<FormRules>(() => ({
    email: createRules.email(),
    password: createRules.password()
  }))

  const valid = computed(() => {
    return (
      formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
      formData.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/) &&
      formData.password.length >= 8
    );
  });

  async function submit() {
    if (!formRef.value) return;

    await formRef.value.validate((valid) => {
      if (valid) {
        auth.login(formData);
      }
    });
  }
</script>
