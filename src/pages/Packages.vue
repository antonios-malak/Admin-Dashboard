<template>
  <div class="packages">
    <PageHeader 
      :title="$t('packages.title')" 
      :subtitle="$t('packages.subtitle')" 
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
</script>

<style scoped>
.packages {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
