<template>
  <div class="p-6">
    <h1>{{ t('communityPosts.title') }}</h1>
    <p>{{ t('communityPosts.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// Community posts management page
</script>
