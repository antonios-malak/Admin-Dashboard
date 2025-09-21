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
  <h2 class="text-2xl font-bold mb-4 text-center">{{ $t('otp.title') }}</h2>
      <el-form
        ref="formRef"
        :model="formData"
        label-position="top"
        @submit.prevent="submit"
      >
          <el-form-item prop="otp" class="otp-form-item-center">
            <div class="otp-label">{{ $t('otp.label') }}</div>
            <div class="otp-boxes">
                <el-input
                  v-for="(digit, idx) in 4"
                  :key="idx"
                  v-model="formData.otp[idx]"
                  maxlength="1"
                  class="otp-input"
                  @input="onOtpInput(idx, $event)"
                  type="text"
                  pattern="[0-9]*"
                  autocomplete="one-time-code"
                  :ref="el => otpInputRefs[idx] = el"
                />
            </div>
          </el-form-item>
        <el-button
          type="primary"
          @click="submit"
          class="w-full"
          :loading="auth.loading"
        >{{ $t('otp.button') }}</el-button>
        
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
      otp: Array(4).fill("")
  });

    // Refs for each input
      const otpInputRefs = Array(4).fill(null);

    // Move to next input on entry
    function onOtpInput(idx, val) {
      if (val && val.length === 1 && idx < 3) {
        otpInputRefs[idx + 1]?.focus();
      }
      // Only allow numbers
      if (/[^0-9]/.test(val)) {
        formData.otp[idx] = val.replace(/[^0-9]/g, "");
      }
    }

  async function submit() {
     const otp = formData.otp.join("");
     console.log(email);
     auth.verifyOtp( email , otp);
  }
</script>

<style scoped>

.otp-form-item-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.otp-label {
  margin-bottom: 10px;
  font-weight: 500;
  color: #409eff;
}
.otp-boxes {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.otp-input {
  width: 50px;
  font-size: 24px;
  text-align: center;
}

</style>
