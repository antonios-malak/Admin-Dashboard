<template>
  <div>
    <el-card class="max-w-[800px] mx-auto mt-20 p-x-6 py-10">
      <template #header>
        <div class="flex justify-end">
          <el-select v-model="$i18n.locale" style="width: 100px" size="small">
            <el-option label="English" value="en" />
            <el-option label="العربية" value="ar" />
          </el-select>
        </div>
      </template>
      <h2 class="text-2xl font-bold mb-4 text-center">{{ $t("otp.title") }}</h2>
      <el-form
        ref="formRef"
        :model="formData"
        label-position="top"
        @submit.prevent="submit"
      >
        <el-form-item prop="otp" class="otp-form-item-center">
          <div class="otp-label">{{ $t("otp.label") }}</div>
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
              :ref="(el) => (otpInputRefs[idx] = el)"
            />
          </div>
        </el-form-item>
        <div class="flex justify-center">
          <el-button
            type="primary"
            @click="submit"
            class="w-1/2"
            :loading="auth.loading"
            >{{ $t("otp.button") }}</el-button
          >
        </div>
      </el-form>
      <p class="mt-5">
        {{ $t('otp.notReceived') }}
        <span
          :style="['ml-1', resendDisabled ? 'color: #9ca3af' : 'color: var(--primary); cursor: pointer']"
          @click="!resendDisabled && resendOtp()"
        >
          {{ $t('otp.resend') }}
        </span>
        <span v-if="resendDisabled" class="ml-2 text-sm" style="color: var(--text-secondary)">({{ timer }}s)</span>
      </p>
    </el-card>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from "vue";
  import { useAuthStore } from "@/stores/auth";
  import router from "@/router";
  import { useRoute } from "vue-router";
  const route = useRoute();
  const email = route.query.email;

  const formRef = ref();
  const auth = useAuthStore();

  const formData = reactive({
    otp: Array(4).fill(""),
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
    auth.verifyOtp(email, otp);
  }
  import { onUnmounted } from 'vue';
  const timer = ref(0);
  const resendDisabled = ref(false);

  function startResendTimer() {
    resendDisabled.value = true;
    timer.value = 60;
    const interval = setInterval(() => {
      timer.value--;
      if (timer.value <= 0) {
        resendDisabled.value = false;
        clearInterval(interval);
      }
    }, 1000);
    // Clean up interval on unmount
    onUnmounted(() => clearInterval(interval));
  }

  async function resendOtp() {
    if (resendDisabled.value) return;
    auth.forgotPassword(email);
    startResendTimer();
  }

  // Start timer on first click
  // Optionally, start on mount if needed
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
