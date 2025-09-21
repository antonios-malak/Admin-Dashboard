<template>
  <el-card class="mb-3">
    <h2 class="font-bold">Dashboard Overview</h2>
    <p>Welcome to your dashboard 🚀</p>
  </el-card>
  
  <div class="p-6">
    <PageHeader title="Statistics" />
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <el-card v-for="(stat, index) in stats" :key="index" class="stat-card text-center">
        <div class="text-3xl font-bold text-blue-600 mb-2">{{ stat.value }}</div>
        <div class="text-gray-600 capitalize">{{ stat.key }}</div>
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
    const response = await api.get('/api/stats')
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
