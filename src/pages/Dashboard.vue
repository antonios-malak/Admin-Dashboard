<template>
  <el-card class="mb-3">
    <h2 class="font-bold">{{ $t('dashboard.overview.title') }}</h2>
    <p>{{ $t('dashboard.overview.welcome') }}</p>
  </el-card>
  
  <div class="p-6">
    <PageHeader :title="$t('dashboard.statistics.title')" />
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <el-card v-for="(stat, index) in stats" :key="index" class="text-center" style="transition: transform 0.2s ease;" @mouseenter="$event.target.style.transform = 'translateY(-2px)'" @mouseleave="$event.target.style.transform = 'translateY(0)'">
        <div class="text-3xl font-bold mb-2" style="color: var(--primary)">{{ stat.value }}</div>
        <div class="capitalize" style="color: var(--text-secondary)">{{ stat.key }}</div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/utils/api'
import PageHeader from '@/components/PageHeader.vue'

const stats = ref<any>()
const loading = ref(false)
const fetchStats = async () => {
  loading.value = true
  try {
    const response = await api.get('/stats')
    // If response.data is an object, convert it to an array of { key, value } objects
    if (Array.isArray(response.data)) {
      stats.value = response.data
    } else {
      stats.value = Object.entries(response.data).map(([key, value]) => ({ key, value }))
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
}
</style>
