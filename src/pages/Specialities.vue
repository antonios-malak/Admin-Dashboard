<template>
  <div class="p-6">
    <PageHeader :title="$t('specialities.title')" :subtitle="$t('specialities.description')" />

    <!-- Header actions -->
    <div class="mb-4 flex gap-4 items-center">
      <SearchInput
        v-model="searchQuery"
        :placeholder="$t('specialities.searchPlaceholder')"
        class="flex-1"
      />
      <StatusFilter
        v-model="statusFilter"
        :options="statusOptions"
        :placeholder="$t('roles.filterPlaceholder')"
      />
      <el-button type="primary" @click="openAddDialog">{{ $t('specialities.addButton') }}</el-button>
    </div>

    <!-- Table with server pagination -->
    <DataTable
      :data="filtered"
      :columns="tableColumns"
      :loading="specialitiesStore.loading"
      :empty-message="$t('specialities.table.emptyMessage')"
      :actions-min-width="220"
      :actions-label="$t('specialities.table.actions')"
    >
      <template #index="{ index }">
        <span>{{ baseIndex + index + 1 }}</span>
      </template>
      <template #nameCol="{ row }">
        <span>{{ row.name }}</span>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.is_active ? 'success' : 'info'">
          {{ row.is_active ? $t('specialities.status.active') : $t('specialities.status.inactive') }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <ActionButtons
          :item="row"
          :show-view="true"
          :show-edit="true"
          :show-delete="true"
          :show-status="true"
          :view-text="$t('common.actions.view')"
          :edit-text="$t('common.actions.edit')"
          :delete-text="$t('common.actions.delete')"
          :status-disable-text="$t('common.actions.disable')"
          :status-enable-text="$t('common.actions.enable')"
          @view="viewSpeciality"
          @edit="openEditDialog"
          @delete="confirmDelete"
          @toggleStatus="confirmToggle"
        />
      </template>
    </DataTable>

    <!-- Server pagination controls -->
    <div class="mt-4 flex items-center justify-end gap-2" v-if="specialitiesStore.lastPage > 1">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="specialitiesStore.currentPage"
        :page-size="specialitiesStore.perPage"
        :total="specialitiesStore.totalItems"
        @current-change="handlePageChange"
      />
    </div>

    <!-- Add/Edit Dialog -->
    <FormDialog
      v-model:visible="showForm"
      :title="formTitle"
      :model-value="formData"
      :fields="formFields"
      :rules="formRules"
      :loading="specialitiesStore.loading || emojisStore.loading"
      :submit-text="$t('users.form.buttons.submit')"
      :cancel-text="$t('users.form.buttons.cancel')"
      @submit="handleSubmit"
      @close="resetForm"
    >
      <!-- Color picker slot -->
      <template #color="{ value, updateValue }">
        <div class="flex items-center gap-3">
          <el-color-picker
            :model-value="value"
            @update:model-value="(v:string)=> updateValue(formatHex(v))"
            color-format="hex"
            :show-alpha="false"
          />
          <el-input class="w-36" :model-value="value" @update:model-value="(v:string)=> updateValue(formatHex(v))" />
        </div>
      </template>
      <!-- Emoji select slot -->
      <template #emoji_id="{ value, updateValue }">
        <el-select :model-value="value" @update:model-value="updateValue" filterable class="w-full">
          <el-option
            v-for="e in emojisStore.emojis"
            :key="e.id"
            :label="e.symbol?.en || e.symbol?.ar || e.id"
            :value="e.id"
          />
        </el-select>
      </template>
    </FormDialog>

    <!-- View Dialog -->
    <el-dialog v-model="showView" :title="$t('specialities.form.viewTitle')" width="520px">
      <div class="p-4 rounded" :style="{ background: viewing?.color || '#fafafa' }">
        <div class="text-white font-semibold mb-2" v-if="viewing?.color">{{ viewing.color }}</div>
        <div class="space-y-2 bg-white/80 p-3 rounded">
          <div><b>ID:</b> {{ viewing?.id }}</div>
          <div><b>{{ $t('specialities.form.fields.nameEn') }}:</b> {{ viewing?.name?.en }}</div>
          <div><b>{{ $t('specialities.form.fields.nameAr') }}:</b> {{ viewing?.name?.ar }}</div>
          <div v-if="viewing?.emoji">
            <b>Emoji:</b> {{ viewing.emoji.symbol?.en }}
          </div>
          <div>
            <b>{{ $t('specialities.table.status') }}:</b>
            {{ viewing?.is_active ? $t('specialities.status.active') : $t('specialities.status.inactive') }}
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model="showConfirmModal"
      :title="confirmModalData?.title || ''"
      :message="confirmModalData?.message || ''"
    :confirm-text="confirmModalData?.confirmText || $t('users.form.buttons.submit')"
    :confirm-type="confirmModalData?.confirmType || 'danger'"
      :cancel-text="$t('users.form.buttons.cancel')"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfirmModal from '@/components/ConfirmModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/DataTable.vue'
import SearchInput from '@/components/SearchInput.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import FormDialog from '@/components/FormDialog.vue'
import StatusFilter from '@/components/StatusFilter.vue'
import { useSpecialitiesStore } from '@/stores/specialities'
import { useEmojisStore } from '@/stores/emojis'
import { createRules } from '@/utils/validation'

const specialitiesStore = useSpecialitiesStore()
const emojisStore = useEmojisStore()
const { t } = useI18n()

const searchQuery = ref('')
const statusFilter = ref('')
const showForm = ref(false)
const isEditing = ref(false)
const editingId = ref<string | number | null>(null)
const showView = ref(false)
const viewing = ref<any>(null)
const showConfirmModal = ref(false)
const confirmModalData = ref<{ title: string, message: string, action: () => void, confirmText?: string, confirmType?: 'primary' | 'success' | 'warning' | 'danger' | '' } | null>(null)

const tableColumns = computed(() => [
  { prop: 'index', label: '#', width: '60', slot: 'index' },
  { prop: 'name', label: t('specialities.table.name') as any, minWidth: '220', slot: 'nameCol' },
  { prop: 'status', label: t('specialities.table.status') as any, width: '160', slot: 'status' }
])

const statusOptions = computed(() => [
  { label: t('specialities.status.active'), value: 'active' },
  { label: t('specialities.status.inactive'), value: 'inactive' }
])

const filtered = computed(() => {
  let list = specialitiesStore.searchSpecialities(searchQuery.value)
  if (statusFilter.value) {
    list = list.filter((s: any) => (statusFilter.value === 'active' ? s.is_active : !s.is_active))
  }
  return list
})

const baseIndex = computed(() => {
  const page = Number(specialitiesStore.currentPage) || 1
  const size = Number(specialitiesStore.perPage) || filtered.value.length || 0
  return (page - 1) * size
})

const formData = ref<Record<string, any>>({
  nameEn: '',
  nameAr: '',
  color: '#000000',
  emoji_id: ''
})

const formFields = computed(() => [
  { prop: 'nameEn', label: t('specialities.form.fields.nameEn') as any, type: 'input', required: true },
  { prop: 'nameAr', label: t('specialities.form.fields.nameAr') as any, type: 'input', required: true },
  { prop: 'color', label: t('specialities.form.fields.color') as any, type: 'slot', required: true },
  { prop: 'emoji_id', label: t('specialities.form.fields.emoji') as any, type: 'slot', required: true }
])

const formRules = computed(() => ({
  nameEn: createRules.nameEn(),
  nameAr: createRules.nameAr(),
  color: createRules.hexColor(),
  emoji_id: createRules.emojiId()
}))

const formTitle = computed(() => isEditing.value ? t('specialities.form.editTitle') as string : t('specialities.form.addTitle') as string)

function formatHex(v: string) {
  if (!v) return ''
  return v.startsWith('#') ? v : `#${v}`
}

function openAddDialog() {
  isEditing.value = false
  editingId.value = null
  resetForm()
  showForm.value = true
}

async function openEditDialog(row: any) {
  try {
    isEditing.value = true
    editingId.value = row.id
    const data = await specialitiesStore.fetchSpecialityById(row.id)
    formData.value = {
      nameEn: data?.name && typeof data.name !== 'string' ? (data.name.en || '') : (data?.name as any) || '',
      nameAr: data?.name && typeof data.name !== 'string' ? (data.name.ar || '') : (data?.name as any) || '',
      color: data?.color || '#000000',
      emoji_id: data?.emoji?.id || ''
    }
    showForm.value = true
  } catch {}
}

async function viewSpeciality(row: any) {
  const data = await specialitiesStore.fetchSpecialityById(row.id)
  viewing.value = data
  showView.value = true
}

function resetForm() {
  formData.value = { nameEn: '', nameAr: '', color: '#000000', emoji_id: '' }
}

async function handleSubmit(payload: Record<string, any>) {
  const fd = new FormData()
  fd.append('name[en]', payload?.nameEn ?? formData.value.nameEn)
  fd.append('name[ar]', payload?.nameAr ?? formData.value.nameAr)
  fd.append('color', payload?.color ?? formData.value.color)
  if (payload?.emoji_id) fd.append('emoji_id', String(payload.emoji_id))
  try {
    if (isEditing.value && editingId.value !== null) {
      await specialitiesStore.updateSpeciality(editingId.value, fd)
    } else {
      await specialitiesStore.addSpeciality(fd)
    }
    showForm.value = false
    resetForm()
  } catch {}
}

function confirmDelete(row: any) {
  confirmModalData.value = {
    title: t('specialities.messages.confirmDelete.title') as string,
    message: t('specialities.messages.confirmDelete.message', { name: row.name }) as string,
    confirmText: t('users.form.buttons.delete') as string,
    confirmType: 'danger',
    action: async () => {
      await specialitiesStore.deleteSpeciality(row.id)
    }
  }
  showConfirmModal.value = true
}

function confirmToggle(row: any) {
  confirmModalData.value = {
    title: (row.is_active ? t('specialities.messages.confirmDisable.title') : t('specialities.messages.confirmEnable.title')) as string,
    message: (row.is_active ? t('specialities.messages.confirmDisable.message') : t('specialities.messages.confirmEnable.message')) as string,
    confirmText: t('users.form.buttons.submit') as string,
    confirmType: 'success',
    action: async () => {
      await specialitiesStore.toggleSpecialityStatus(row.id)
    }
  }
  showConfirmModal.value = true
}

function handleConfirm() {
  if (confirmModalData.value) {
    confirmModalData.value.action()
    showConfirmModal.value = false
    confirmModalData.value = null
  }
}

function handleCancel() {
  showConfirmModal.value = false
  confirmModalData.value = null
}

onMounted(() => {
  specialitiesStore.fetchSpecialities(specialitiesStore.currentPage)
  emojisStore.fetchEmojis()
})

function handlePageChange(page: number) {
  specialitiesStore.fetchSpecialities(page)
}
</script>

<style scoped>
</style>


