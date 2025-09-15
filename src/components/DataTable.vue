<template>
  <div>
    <div v-if="loading" class="flex justify-center">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
    
    <!-- Responsive table wrapper with horizontal scroll -->
    <div 
      v-else 
      class="overflow-x-auto border border-gray-200 rounded-lg"
    >
      <el-table 
        :data="data" 
        border 
        stripe 
        style="min-width: 100%; width: max-content"
        v-bind="$attrs"
      >
        <el-table-column 
          v-for="column in columns" 
          :key="column.prop || column.label"
          v-bind="column"
          :min-width="column.minWidth || (column.width ? undefined : '130')"
        >
          <template v-if="column.slot" #default="scope">
            <slot :name="column.slot" :row="scope.row" :index="scope.$index" />
          </template>
        </el-table-column>
        
        <el-table-column 
          v-if="showActions" 
          label="Actions" 
          :width="actionsWidth"
          :min-width="actionsWidth"
          :fixed="fixedActions ? 'right' : false"
        >
          <template #default="scope">
            <slot name="actions" :row="scope.row" :index="scope.$index" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <div v-if="!loading && data.length === 0" class="text-center text-gray-500 mt-8">
      {{ emptyMessage || 'No data found' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

interface Column {
  prop?: string
  label: string
  width?: string | number
  minWidth?: string | number
  slot?: string
  [key: string]: any
}

interface Props {
  data: any[]
  columns: Column[]
  loading?: boolean
  showActions?: boolean
  actionsWidth?: string | number
  fixedActions?: boolean
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: false,
  actionsWidth: 120,
  fixedActions: false,
  emptyMessage: 'No data found'
})
</script>
