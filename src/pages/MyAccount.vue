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
            <h3 class="text-lg font-semibold">
              {{ $t("myAccount.profileInformation.title") }}
            </h3>
          </div>
        </template>

        <div class="space-y-6">
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-position="top"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label
                  class="block text-sm font-semibold mb-2"
                  style="color: var(--text-primary)"
                  >{{ $t("myAccount.profileInformation.fullName") }}</label
                >
                <el-form-item prop="name">
                  <el-input
                    v-model="profileForm.name"
                    :maxlength="100"
                    show-word-limit
                    style="
                      border-radius: 8px;
                      border: 1px solid #e5e7eb;
                      transition: border-color 0.2s ease;
                    "
                    size="large"
                  />
                </el-form-item>
              </div>
              <div class="space-y-2">
                <label
                  class="block text-sm font-semibold mb-2"
                  style="color: var(--text-primary)"
                  >{{ $t("myAccount.profileInformation.emailAddress") }}</label
                >
                <el-form-item prop="email">
                  <el-input
                    v-model="profileForm.email"
                    :maxlength="100"
                    show-word-limit
                    style="
                      border-radius: 8px;
                      border: 1px solid #e5e7eb;
                      transition: border-color 0.2s ease;
                    "
                    size="large"
                  />
                </el-form-item>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label
                  class="block text-sm font-semibold mb-2"
                  style="color: var(--text-primary)"
                  >{{ $t("myAccount.profileInformation.role") }}</label
                >
                <el-input
                  v-model="userInfo.role"
                  readonly
                  class="readonly-input"
                  style="
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    transition: border-color 0.2s ease;
                  "
                  size="large"
                />
              </div>
              <div class="space-y-2">
                <label
                  class="block text-sm font-semibold mb-2"
                  style="color: var(--text-primary)"
                  >{{ $t("myAccount.profileInformation.memberSince") }}</label
                >
                <el-input
                  v-model="userInfo.createdAt"
                  readonly
                  class="readonly-input"
                  style="
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    transition: border-color 0.2s ease;
                  "
                  size="large"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="space-y-2">
                <label
                  class="block text-sm font-semibold mb-2"
                  style="color: var(--text-primary)"
                  >{{ $t("users.form.phone") }}</label
                >
                <el-form-item prop="phone">
                  <div class="flex gap-2">
                    <el-select
                      v-model="profileForm.countryCode"
                      class="basis-[175px]"
                      filterable
                    >
                      <el-option
                        v-for="option in countryCodes"
                        :key="option.value"
                        :label="option.label"
                        :value="option.dial"
                      />
                    </el-select>
                    <el-input
                      v-model="profileForm.phone"
                      maxlength="15"
                      show-word-limit
                    />
                  </div>
                </el-form-item>
              </div>
              <div class="space-y-2">
                <label
                  class="block text-sm font-semibold mb-2"
                  style="color: var(--text-primary)"
                  >{{ $t("myAccount.profileInformation.userImage") }}</label
                >
                <div class="flex items-center gap-4">
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :before-upload="handleAvatarUpload"
                    accept="image/png,image/jpeg"
                  >
                    <el-avatar
                      v-if="profileForm.avatarPreview || userAvatar"
                      :src="profileForm.avatarPreview || userAvatar"
                      :size="80"
                      shape="circle"
                    />
                    <el-icon v-else class="avatar-uploader-icon"
                      ><User
                    /></el-icon>
                  </el-upload>
                  <div class="text-xs text-gray-500">
                    {{ $t("users.messages.avatarUpload.fileTypeInfo") }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Password inline block moved just under name/email via the toggle below -->

            <div class="grid grid-cols-1 gap-4 mt-4">
              <div v-if="!showPasswordFields" class="flex justify-center">
                <el-button type="default" @click="showPasswordFields = true">{{
                  $t("myAccount.securitySettings.changePassword.button")
                }}</el-button>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label
                    class="block text-sm font-semibold mb-2"
                    style="color: var(--text-primary)"
                    >{{
                      $t(
                        "myAccount.securitySettings.changePassword.newPassword"
                      )
                    }}</label
                  >
                  <el-form-item prop="password">
                    <el-input
                      v-model="profileForm.password"
                      type="password"
                      show-password
                      maxlength="25"
                    />
                  </el-form-item>
                </div>
                <div class="space-y-2">
                  <label
                    class="block text-sm font-semibold mb-2"
                    style="color: var(--text-primary)"
                    >{{
                      $t(
                        "myAccount.securitySettings.changePassword.confirmPassword"
                      )
                    }}</label
                  >
                  <el-form-item prop="password_confirmation">
                    <el-input
                      v-model="profileForm.password_confirmation"
                      type="password"
                      show-password
                      maxlength="25"
                    />
                  </el-form-item>
                </div>
              </div>
              <div class="flex justify-end">
                <el-button
                  type="primary"
                  :loading="profileStore.loading"
                  @click="submitProfile"
                  >{{ $t("myAccount.updateProfile.button") }}</el-button
                >
              </div>
            </div>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from "vue";
  import { useAuthStore } from "@/stores/auth";
  import { useProfileStore } from "@/stores/profile";
  import { useI18n } from "vue-i18n";
  import { useCountriesStore } from "@/stores/countries";
  import { User } from "@element-plus/icons-vue";
  import PageHeader from "@/components/PageHeader.vue";

  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const countriesStore = useCountriesStore();
import { createRules } from '@/utils/validation'
  // Removed dialog-related state

  // User information from /profile endpoint
  const userInfo = computed(() => {
    const user = profileStore.profile;
    return {
      name: user?.name || "N/A",
      email: user?.email || "N/A",
      role: user?.role?.name || "Admin",
      createdAt: user?.created_at
        ? new Date(user.created_at).toLocaleDateString()
        : "N/A",
    };
  });
  // Avatar and form state
  const userAvatar = computed(() => profileStore.profile?.image || "");
  const profileFormRef = ref();
  const profileForm = reactive({
    name: "",
    email: "",
    countryCode: "+966",
    phone: "",
    password: "",
    password_confirmation: "",
    avatar: null as File | null,
    avatarPreview: "",
  });
  const showPasswordFields = ref(false);

  // Country codes from store
  const countryCodes = computed(() => countriesStore.options);

  // Initialize form from profile
  function hydrateForm() {
    const u = profileStore.profile;
    if (!u) return;
    profileForm.name = u.name || "";
    profileForm.email = u.email || "";
    const raw = (u.phone || "").toString().trim();
    if (!raw) {
      profileForm.countryCode = "+966";
      profileForm.phone = "";
      return;
    }
    // Known country codes list
    const codes = countryCodes.value.map((c) => c.dial); // with '+'
    // Case 1: starts with +code
    const codeMatch = codes.find((c) => raw.startsWith(c));
    if (codeMatch) {
      profileForm.countryCode = codeMatch;
      profileForm.phone = raw.slice(codeMatch.length);
      return;
    }
    // Case 2: starts with code digits without '+' (e.g., 9665...)
    const codesNoPlus = codes.map((c) => c.replace("+", ""));
    const found = codesNoPlus.find((c) => raw.startsWith(c));
    if (found) {
      profileForm.countryCode = `+${found}`;
      profileForm.phone = raw.slice(found.length);
      return;
    }
    // Case 3: pattern like ISO3+phone_code prefixed
    const foundIso3 = countryCodes.value.find((c) =>
      raw.startsWith(`${c.iso3}+${c.dial.replace("+", "")}`)
    );
    if (foundIso3) {
      profileForm.countryCode = foundIso3.dial;
      profileForm.phone = raw.slice(
        (foundIso3.iso3 + "+" + foundIso3.dial.replace("+", "")).length
      );
      return;
    }
    // Fallback: keep default code and put all digits in phone
    profileForm.countryCode = "+966";
    profileForm.phone = raw;
  }

  const profileRules = computed(() => ({
    name: createRules.name(),
    email: createRules.email(),
    phone: createRules.phone(),
    password: createRules.password(),
    password_confirmation: createRules.confirmPassword(() => profileForm.password)
  }))

  // Avatar upload handling
  function handleAvatarUpload(file: File) {
    const isImage = file.type === "image/png" || file.type === "image/jpeg";
    if (!isImage) return false;
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) return false;
    const reader = new FileReader();
    reader.onload = (e) => {
      profileForm.avatarPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    profileForm.avatar = file;
    return false;
  }

  // Submit
  async function submitProfile() {
    if (!profileFormRef.value) return;
    await profileFormRef.value.validate();
    const selectedCode = countryCodes.value.find(
      (c) => c.dial === profileForm.countryCode
    );
    await profileStore.updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: `${profileForm.countryCode}${profileForm.phone.replace(
        /\D/g,
        ""
      )}`,
      image: profileForm.avatar,
      password: profileForm.password || undefined,
      password_confirmation: profileForm.password
        ? profileForm.password_confirmation
        : undefined,
      countryCode: selectedCode?.iso,
    });
  }

  // Removed legacy password dialog state/handlers

  onMounted(async () => {
    // Ensure user is logged in
    if (!authStore.isLoggedIn) {
      authStore.logout();
      return;
    }
    // Fetch profile from API
    try {
      await countriesStore.fetchCountries();
      await profileStore.fetchProfile();
      hydrateForm();
    } catch (e) {
      // Optional: handle error UI here
    }
  });
</script>

<style scoped>
  .el-card {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

  /* Readonly input background to indicate blocked */
  :deep(.readonly-input) .el-input__wrapper {
    background-color: #f3f4f6;
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
