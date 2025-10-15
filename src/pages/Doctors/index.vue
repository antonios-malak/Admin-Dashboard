<template>
  <div class="p-6">
    <PageHeader :title="$t('doctors.title')" :subtitle="$t('doctors.description')" />
    <div class="mb-4 flex justify-end">
      <el-button type="primary" @click="goToRequests">
        {{ $t('doctors.requestsButton') }}
      </el-button>
    </div>
    <!-- Content for Doctors management can be added here -->
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goToRequests = () => {
  router.push('/doctors/requests')
}
</script>

<style scoped>
</style>


