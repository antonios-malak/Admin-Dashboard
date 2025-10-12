<template>
  <div class="app-settings">
    <PageHeader 
      :title="$t('appSettings.title')" 
      :subtitle="$t('appSettings.subtitle')" 
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
</script>

<style scoped>
.app-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
