<template>
  <div class="auto-consultation-page">
    <div class="page-header">
      <h1 class="page-title">{{ $t('autoConsultation.title') }}</h1>
      <p class="page-subtitle">{{ $t('autoConsultation.subtitle') }}</p>
    </div>
    
    <div class="page-content">
      <!-- Page content will be added here -->
    </div>
  </div>
</template>

<script setup lang="ts">
// AutoConsultation page - content will be added later
</script>

<style scoped>
.auto-consultation-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
}

.page-content {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
}
</style>
