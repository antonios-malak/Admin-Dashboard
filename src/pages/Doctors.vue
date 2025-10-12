<template>
  <div class="p-6">
    <h1>{{ t('doctors.title') }}</h1>
    <p>{{ t('doctors.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// Doctors management page
</script>
