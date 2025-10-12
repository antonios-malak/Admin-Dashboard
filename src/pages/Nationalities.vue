<template>
  <div class="nationalities">
    <PageHeader 
      :title="$t('nationalities.title')" 
      :subtitle="$t('nationalities.subtitle')" 
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
</script>

<style scoped>
.nationalities {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
