<template>
  <div class="p-6">
    <h1>{{ t('advertisements.title') }}</h1>
    <p>{{ t('advertisements.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// Advertisements management page
</script>
