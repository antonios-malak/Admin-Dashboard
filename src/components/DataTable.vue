<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
    
    <!-- Table -->
    <div v-else-if="data.length > 0" class="overflow-x-auto border border-gray-200 rounded-lg">
      <el-table :data="data" border stripe v-bind="$attrs">
        <el-table-column 
          v-for="column in columns" 
          :key="column.prop || column.label"
          v-bind="column"
        >
          <template v-if="column.slot" #default="scope">
            <slot :name="column.slot" :row="scope.row" :index="scope.$index" />
          </template>
        </el-table-column>
        
        <el-table-column v-if="$slots.actions" label="Actions" width="120" >
          <template #default="scope">
            <slot name="actions" :row="scope.row" :index="scope.$index" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- Empty state -->
    <div v-else class="text-center text-gray-500 py-8">
      {{ emptyMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

withDefaults(defineProps<{
  data: any[]
  columns: any[]
  loading?: boolean
  emptyMessage?: string
}>(), {
  loading: false,
  emptyMessage: 'No data found'
})
</script>
