<template>
  <div class="p-6">
    <h1>{{ t('countries.title') }}</h1>
    <p>{{ t('countries.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// Countries management page
</script>
