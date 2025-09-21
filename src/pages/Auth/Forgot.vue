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
  <h2 class="mb-4 text-center font-bold">{{ $t('forgot.title') }}</h2>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="validationRules"
        @submit.prevent="submit"
      >
        <el-form-item prop="Email" >
          <el-input class="mb-4" v-model="formData.Email" :placeholder="$t('forgot.email')" />
        </el-form-item>
        
        <el-form-item >
          <el-button
            type="primary"
            @click="submit"
            class="w-full mt-2"
            :loading="auth.loading"
            :disabled="!valid"
          >{{ $t('forgot.button') }}</el-button>
          
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from "vue";
  import { useI18n } from 'vue-i18n';
  import type { FormInstance, FormRules } from "element-plus";
  import { useAuthStore } from "@/stores/auth";

  const formRef = ref<FormInstance>();
  const { t } = useI18n();
  const auth = useAuthStore();

  const formData = reactive({
    Email: "",
    password: "",
  });

  const validationRules = computed<FormRules>(() => ({
    Email: [
      { required: true, message: t('forgot.validation.email_required'), trigger: "blur" },
      {
        max: 100,
        message: t('forgot.validation.email_max'),
        trigger: "blur",
      },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: t('forgot.validation.email_invalid'),
        trigger: "blur",
      },
    ],
  }));

  const valid = computed(() => {
    return (
      formData.Email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) 
    );
  });

  async function submit() {
    if (!formRef.value) return;

    await formRef.value.validate((valid) => {
      if (valid) {
        auth.forgotPassword(formData.Email);
      }
    });
  }
</script>
