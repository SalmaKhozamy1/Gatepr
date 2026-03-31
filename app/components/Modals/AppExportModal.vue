<template>
  <ModalsAppModal
    :model-value="modelValue"
    :title="t('items.import')"
    :icon="IconsTerms"
    width="650px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="import-modal-content">
      <!-- Download Template Button -->
      <button class="template-btn w-100 flex-center gap-xs mb-4" @click="handleDownloadTemplate">
        <span class="flex-end gap-xs"> <span class="plus-icon">+</span> {{ t('common.download_template') }}</span>
      
      </button>

      <!-- Reusable File Uploader -->
      <InputsFileUploader
        v-model="files"
        accept=".xlsx, .xls, .csv"
        accept-label="XLSX , XLS , CSV"
      />
    </div>

    <template #footer>
      <ButtonsFormActions
        :loading="loading"
        :disabled-save="!files.length"
        @cancel="emit('update:modelValue', false)"
        @save="handleImport"
        class="w-100"
      />
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'
import { IconsTerms, IconsDownload } from '#components'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'success'])

const { t } = useI18n()
const api = useApi()
const toast = useAppToast()

const files = ref([])
const loading = ref(false)

const handleDownloadTemplate = () => {
  // Placeholder for template download
  toast.info('جاري تحميل التيمبلت...')
}

const handleImport = async () => {
  if (!files.value.length) return

  try {
    loading.value = true
    
    const formData = new FormData()
    // If the API only accepts one file, we take the last one uploaded or the first one.
    // Usually import is one file.
    formData.append('admin[file]', files.value[0])

    const res = await api('/items/import', {
      method: 'POST',
      body: formData
    })

    if (res.success) {
      toast.success(res.message || t('messages.added_successfully', { item: t('menu.item') }))
      emit('success')
      emit('update:modelValue', false)
      files.value = []
    } else {
      toast.error(res.message || t('common.somethingWentWrong'))
    }
  } catch (err) {
    console.error('Import error:', err)
    if (err.data?.errors?.file) {
      toast.error(err.data.errors.file[0])
    } else {
      toast.error(t('common.somethingWentWrong'))
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.import-modal-content {
  padding: 10px 5px;
}

.template-btn {
  background: #FFF;
  border: 1px solid #222;
  border-radius: var(--radius-md);
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #222;
  transition: all 0.2s;
  position: relative;
}

.template-btn:hover {
  background: #f9fafb;
}

.template-btn .plus-icon {
  font-size: 22px;
  font-weight: 400;
}


</style>
