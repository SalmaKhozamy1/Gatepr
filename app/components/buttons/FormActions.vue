<template>
  <div class="d-flex gap-3 justify-content-end mt-3">
    <button class="custom-btn text-btn min-btn-width" @click="$emit('cancel')" :disabled="loading">
      {{ cancelLabel || t('common.cancel') }}
    </button>
    <button class="custom-btn secondary-btn min-btn-width" :disabled="loading" @click="$emit('save')">
      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
      <span>{{ saveLabel || t('common.save') }}</span>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
  loading: { type: Boolean, default: false },
  cancelLabel: { type: String, default: '' },
  saveLabel: { type: String, default: '' },
})

defineEmits(['cancel', 'save'])
</script>