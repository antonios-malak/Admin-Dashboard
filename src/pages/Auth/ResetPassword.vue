<template>
    <div>
    <el-card class="max-w-md mx-auto mt-20 p-6">
         <template #header>
        <div class="flex justify-end">
          <el-select v-model="$i18n.locale" style="width: 100px;" size="small">
            <el-option label="English" value="en" />
            <el-option label="العربية" value="ar" />
          </el-select>
        </div>
      </template>
  <h2 class="text-2xl font-bold mb-4 text-center">{{ $t('resetpassword.title') }}</h2>
        <el-form
          ref="formRef"
          :model="formData"
            :rules="validationRules"
          label-position="top"
          @submit.prevent="submit"
        >
            <el-form-item prop="password">
              <el-input
                class="mb-2"
                v-model="formData.password"
                :placeholder="$t('resetpassword.password')"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                class="my-2"
                v-model="formData.confirmPassword"
                :placeholder="$t('resetpassword.confirmPassword')"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submit"
                class="w-full mt-2 "
                :loading="auth.loading"
              >{{ $t('resetpassword.button') }}</el-button>
            </el-form-item>
        </el-form>
    </el-card>
     
    </div>
</template>

<script setup>
  import { ref, reactive, computed } from "vue";
  import { useAuthStore } from "@/stores/auth";
  import router from "@/router";
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const email = route.query.email;

  const formRef = ref();
  const auth = useAuthStore();

  const formData = reactive({
    email: email || "",
    password: "",
    confirmPassword: ""
  });
    
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const validationRules = computed(() => ({
    password: [
      { required: true, message: t('resetpassword.validation.password_required'), trigger: "blur" },
      { min: 8, message: t('resetpassword.validation.password_min'), trigger: "blur" },
      { max: 25, message: t('resetpassword.validation.password_max'), trigger: "blur" },
      { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: t('resetpassword.validation.password_pattern'), trigger: "blur" }
    ],
    confirmPassword: [
      { required: true, message: t('resetpassword.validation.confirm_required'), trigger: "blur" },
      { validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error(t('resetpassword.validation.confirm_match')));
        } else {
          callback();
        }
      }, trigger: "blur" }
    ]
  }));
    
    const submit = async () => {
        formRef.value.validate(async (valid) => {
            if (valid) {
                try {
                    auth.loading = true;
                    await auth.resetPassword(formData);
                    router.push("/login");
                } catch (error) {
                    // Handle error (e.g., show notification)
                } finally {
                    auth.loading = false;
                }
            }
        });
    };

</script>

<style lang="scss" scoped>

</style>