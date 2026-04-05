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
        class="custom-textarea required"
        :class="{ 'is-invalid': reasonError }"
        :placeholder="t('modals.reject_reason')"
        rows="4"
        @blur="reasonBlur"
      />
      <span v-if="reasonError" class="error d-block">{{ reasonError }}</span>
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
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const { t } = useI18n()

const props = defineProps({
  modelValue: Boolean,
  title:      String,
  icon:       Object,
  supplierId: Number,
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const loading = ref(false)

/* =============================
   SCHEMA
============================== */
const schema = computed(() => yup.object({
  reason: yup.string()
    .required(t('errors.isRequired', { name: t('modals.reject_reason') }))
    .min(10, t('errors.min', { name: t('modals.reject_reason'), num: 10 }))
    .max(500, t('errors.max', { num: 500 })),
}))

const { handleSubmit: veeHandleSubmit, resetForm } = useForm({
  validationSchema: schema,
  validateOnMount: false,
})

const { value: reason, errorMessage: reasonError, handleBlur: reasonBlur } = useField('reason')

/* =============================
   RESET لما الـ modal يتفتح
============================== */
watch(() => props.modelValue, (val) => {
  if (val) resetForm()
})

/* =============================
   ACTIONS
============================== */
const handleClose = () => emit('update:modelValue', false)

const handleSubmit = veeHandleSubmit(() => {
  emit('confirm', {
    reason:     reason.value.trim(),
    setLoading: (val) => { loading.value = val },
    close:      () => emit('update:modelValue', false),
  })
})
</script>