<template>
  <div class="p-6">
    <h1>{{ t('settings.title') }}</h1>
    <p>{{ t('settings.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// App general settings page
</script>
