<template>
  <div class="p-6">
    <h1>{{ t('about.title') }}</h1>
    <p>{{ t('about.description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// About the app page
</script>
