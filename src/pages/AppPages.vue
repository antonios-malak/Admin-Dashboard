<template>
  <div class="p-6">
    <h1>{{ t('appPages.title') }}</h1>
    <p>{{ t('appPages.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// App pages management page
</script>
