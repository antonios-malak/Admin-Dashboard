<template>
  <el-card class="mb-3">
    <h2 class="font-bold">Dashboard Overview</h2>
    <p>Welcome to your dashboard 🚀</p>
  </el-card>
  
  <div class="p-6">
    <PageHeader title="Statistics" />
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <el-card v-for="item in statisticsData" :key="item.id" class="stat-card text-center">
        <div class="text-3xl font-bold text-blue-600 mb-2">{{ item.value }}</div>
        <div class="text-gray-600 capitalize">{{ item.label }}</div>
      </el-card>
    </div>
    <!-- DataTable for products and categories will be added here -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'
import PageHeader from '@/components/PageHeader.vue'

const store = useStatisticsStore()

const statisticsData = computed(() => {
  return Object.entries(store.stats).map(([key, value]) => ({
    id: key,
    key,
    value,
    label: formatKey(key)
  }))
})

onMounted(() => {
  store.fetchStatistics()
})

function formatKey(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
}
</style>
