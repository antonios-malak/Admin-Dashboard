<template>
  <div class="recovery-plans">
    <PageHeader 
      :title="$t('recoveryPlans.title')" 
      :subtitle="$t('recoveryPlans.subtitle')" 
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
</script>

<style scoped>
.recovery-plans {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
