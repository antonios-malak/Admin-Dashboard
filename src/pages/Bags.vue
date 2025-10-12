<template>
  <div class="bags">
    <PageHeader 
      :title="$t('bags.title')" 
      :subtitle="$t('bags.subtitle')" 
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
</script>

<style scoped>
.bags {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
