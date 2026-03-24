<template>
  <ModalsAppModal
    :model-value="modelValue"
    :title="title || t('modals.reject_request')"
    :icon="icon"
    :close-on-backdrop="false"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="form-group w-100">
      <label class="form-label">{{ t('modals.reject_reason') }}</label>
      <textarea
        v-model="reason"
        class="custom-textarea"
        :placeholder="t('modals.reject_reason')"
        rows="4"
      />
      <span v-if="error" class="text-danger small mt-1">{{ error }}</span>
    </div>

    <template #footer>
      <div class="flex-end gap-2 w-100">
        <button
          class="custom-btn text-btn min-btn-width"
          @click="handleClose"
          :disabled="loading"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          class="custom-btn danger-btn min-btn-width"
          @click="handleSubmit"
          :disabled="loading"
        >
          <span v-if="loading">{{ t('common.saving') }}</span>
          <span v-else>{{ t('buttons.reject') }}</span>
        </button>
      </div>
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: Boolean,
  title: String,
  icon: Object,
  supplierId: Number,
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const reason = ref('')
const error = ref('')
const loading = ref(false)

// ✅ reset لما الـ modal يتفتح
watch(() => props.modelValue, (val) => {
  if (val) {
    reason.value = ''
    error.value = ''
  }
})

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  error.value = ''

  if (!reason.value.trim()) {
    error.value = t('errors.reject_reason_required')
    return
  }

  emit('confirm', {
    reason: reason.value.trim(),
    setLoading: (val) => { loading.value = val },
    close: () => emit('update:modelValue', false)
  })
}
</script>
