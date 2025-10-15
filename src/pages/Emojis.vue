<template>
  <div class="p-6">
    <PageHeader :title="$t('emojis.title')" :subtitle="$t('emojis.subtitle')" />
    <div class="mb-4 flex justify-end">
      <el-button type="primary" @click="openAddDialog">{{ t('emojis.addButton') }}</el-button>
    </div>

    <!-- Table -->
    <DataTable
      :data="emojisStore.emojis"
      :columns="tableColumns"
      :loading="emojisStore.loading"
      :empty-message="$t('emojis.table.emptyMessage')"
      :actions-min-width="200"
      :actions-label="$t('emojis.table.actions')"
    >
      <!-- index column slot -->
      <template #index="{ index }">
        <span>{{ baseIndex + index + 1 }}</span>
      </template>
      <!-- symbol.en column -->
      <template #symbol="{ row }">
        <span>{{ row?.symbol?.en || '' }}</span>
      </template>
      <!-- created-at formatted date -->
      <template #createdAt="{ row }">
        <span>{{ formatDate(row?.['created_at']) }}</span>
      </template>
      <!-- actions column -->
      <template #actions="{ row }">
        <ActionButtons
          :item="row"
          :show-view="true"
          :show-edit="true"
          :show-delete="true"
          :show-status="false"
          :view-text="$t('common.actions.view')"
          :edit-text="$t('common.actions.edit')"
          :delete-text="$t('common.actions.delete')"
          @view="viewEmoji"
          @edit="openEditDialog"
          @delete="handleDelete"
        />
      </template>
    </DataTable>

    <!-- Server pagination controls -->
    <div class="mt-4 flex items-center justify-end gap-2" v-if="emojisStore.lastPage > 1">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="emojisStore.currentPage"
        :page-size="emojisStore.perPage"
        :total="emojisStore.totalItems"
        @current-change="handlePageChange"
      />
    </div>

    <!-- View Modal -->
    <el-dialog v-model="showView" :title="$t('emojis.form.viewTitle')" width="480px">
      <div class="flex justify-center">
        <img v-if="viewing?.image" :src="viewing.image" alt="emoji" class="max-h-48"/>
      </div>
    </el-dialog>

    <!-- Add/Edit Dialog using FormDialog -->
    <FormDialog
      v-model:visible="showEdit"
      :title="dialogTitle"
      :model-value="formData"
      :fields="formFields"
      :rules="formRules"
      :loading="emojisStore.loading"
      :submit-text="$t('users.form.buttons.submit')"
      :cancel-text="$t('users.form.buttons.cancel')"
      @submit="handleSubmit"
      @close="resetForm"
    >
      <template #symbolEn="{ value, updateValue }">
        <div class="flex items-center gap-2">
          <el-input :model-value="value" @update:model-value="updateValue" readonly class="flex-1" />
          <el-popover placement="bottom" trigger="click" width="420">
            <template #reference>
              <el-button size="small">{{ t('emojis.form.fields.symbolEn') }}</el-button>
            </template>
            <emoji-picker @emoji-click="(e:any) => updateValue(e.detail?.unicode || e.detail?.emoji?.unicode || '')" style="width: 400px; height: 360px;"></emoji-picker>
          </el-popover>
        </div>
      </template>
      <template #symbolAr="{ value, updateValue }">
        <div class="flex items-center gap-2">
          <el-input :model-value="value" @update:model-value="updateValue" readonly class="flex-1" />
          <el-popover placement="bottom" trigger="click" width="420">
            <template #reference>
              <el-button size="small">{{ t('emojis.form.fields.symbolAr') }}</el-button>
            </template>
            <emoji-picker @emoji-click="(e:any) => updateValue(e.detail?.unicode || e.detail?.emoji?.unicode || '')" style="width: 400px; height: 360px;"></emoji-picker>
          </el-popover>
        </div>
      </template>
      <template #image="{ value, updateValue }">
        <el-upload
          :show-file-list="false"
          :before-upload="(file: File) => handleBeforeImageUpload(file, updateValue)"
          accept="image/png,image/jpeg,image/jpg,image/webp"
        >
          <el-button type="primary" plain size="small">{{ t('emojis.form.fields.imageUrl') }}</el-button>
        </el-upload>
        <div class="mt-2 text-xs text-gray-500" v-if="value && value.name">{{ value.name }}</div>
        <div class="ms-2 mt-2" v-else-if="existingImageUrl">
          <img :src="existingImageUrl" alt="current image" class="h-12 w-12 object-cover rounded border" />
        </div>
      </template>
    </FormDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import FormDialog from '@/components/FormDialog.vue'
import { useEmojisStore } from '@/stores/emojis'
import { createRules } from '@/utils/validation'
import 'emoji-picker-element';
const emojisStore = useEmojisStore()
const { t } = useI18n()

// Computed properties
const baseIndex = computed(() => (Number(emojisStore.currentPage) || 1 - 1) * (Number(emojisStore.perPage) || emojisStore.emojis.length || 0))

const tableColumns = computed(() => [
  { prop: 'index', label: t('emojis.table.index') as any, width: '60', slot: 'index' },
  { prop: 'symbol', label: t('emojis.table.symbol') as any, minWidth: '140', slot: 'symbol' },
  { prop: 'createdAt', label: t('emojis.table.createdAt') as any, minWidth: '160', slot: 'createdAt' },
])

const formatDate = (value?: string) => {
  if (!value) return ''
  const [date] = value.split(' ')
  return date || value
}

// View emoji
const showView = ref(false)
const viewing = ref<any>(null)
const existingImageUrl = ref<string>('')
const viewEmoji = async (row: any) => {
  const data = await emojisStore.fetchEmojiById(row.id)
  viewing.value = data
  showView.value = true
}

// Add/Edit form
const showEdit = ref(false)
const isEditing = ref(false)
const editingId = ref<string | number | null>(null)
const dialogTitle = computed(() => isEditing.value ? t('emojis.form.editTitle') as string : t('emojis.form.addTitle') as string)
const formData = ref<Record<string, any>>({
  symbolEn: '',
  symbolAr: '',
  image: null as File | null
})
const formFields = computed(() => [
  { prop: 'symbolEn', label: t('emojis.form.fields.symbolEn') as any, type: 'slot', required: true },
  { prop: 'symbolAr', label: t('emojis.form.fields.symbolAr') as any, type: 'slot', required: true },
  { prop: 'image', label: t('emojis.form.fields.imageUrl') as any, type: 'slot', required: true },
])
const formRules = computed(() => ({
  symbolEn: createRules.emojiSymbol(),
  symbolAr: createRules.emojiSymbol(),
  image: createRules.imageFile(),
}))

const openEditDialog = (row: any) => {
  isEditing.value = true
  editingId.value = row?.id ?? null
  formData.value = { symbolEn: row?.symbol?.en || '', symbolAr: row?.symbol?.ar || '', image: null }
  existingImageUrl.value = row?.image || ''
  showEdit.value = true
}

const openAddDialog = () => {
  isEditing.value = false
  editingId.value = null
  resetForm()
  showEdit.value = true
}

const resetForm = () => {
  isEditing.value = false
  formData.value = { symbolEn: '', symbolAr: '', image: null }
  existingImageUrl.value = ''
}

const handleSubmit = async (payload: Record<string, any>) => {
  const fd = new FormData()
  fd.append('symbol[en]', payload?.symbolEn ?? formData.value.symbolEn)
  fd.append('symbol[ar]', payload?.symbolAr ?? formData.value.symbolAr)
  if (payload?.image instanceof File) fd.append('image', payload.image)
  else if (formData.value.image instanceof File) fd.append('image', formData.value.image)
  if (isEditing.value && editingId.value !== null) {
    await emojisStore.updateEmoji(editingId.value, fd)
  } else {
    await emojisStore.addEmoji(fd)
  }
  showEdit.value = false
  resetForm()
  editingId.value = null
}

const handleDelete = async (row: any) => {
  await emojisStore.deleteEmoji(row.id)
}

function handleBeforeImageUpload(file: File, updateValue: (v: any) => void) {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  const ok = allowed.includes(file.type.toLowerCase())
  if (!ok) {
    // Basic client-side guard; backend still validates
    return false
  }
  updateValue(file)
  formData.value.image = file
  return false // prevent auto upload
}

// Pagination handler
const handlePageChange = (page: number) => {
  emojisStore.fetchEmojis(page)
}

onMounted(() => {
  emojisStore.fetchEmojis(emojisStore.currentPage)
})
</script>

<style scoped>
</style>
