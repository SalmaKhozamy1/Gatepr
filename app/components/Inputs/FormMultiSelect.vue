<template>
  <div class="form-group">
    <label v-if="label" class="form-label d-flex align-items-center gap-xs">
      {{ label }}
      <span v-if="modelValue?.length" class="count-badge">
        {{ modelValue.length }}
      </span>
    </label>
    <MultiSelect
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="placeholder || t('placeholders.select')"
      :class="['w-100', { 'is-invalid': error }]"
      display="chip"
      :filter="true"
      :filter-placeholder="t('common.search')"
      :empty-message="t('common.no_results_found')"
      :empty-filter-message="t('common.no_results_found')"
      append-to="body"
      :max-selected-labels="2"
      :selected-items-label="t('common.selected_items')"
    />
    <span v-if="error" class="error d-block">{{ error }}</span>
  </div>
</template>

<script setup>
import MultiSelect from 'primevue/multiselect'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  label: { type: String, default: '' },
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Root */
.count-badge {
  background-color: var(--primary-color);
  color: white;
  font-size: 10px;
  line-height: normal;
  padding: 2px 6px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
}

:deep(.p-multiselect) {
  width: 100%;
  font-size: var(--size-sm) !important;
  border-radius: var(--radius-sm) !important;
  border: 1px solid #e0e0e0 !important;
  box-shadow: none !important;
  min-height: 40px;
}

:deep(.p-multiselect:focus) {
  border-color: var(--secondary-color) !important;
  box-shadow: none;
  outline: none !important;
}

/* chips */
:deep(.p-multiselect-chip-item) {
  margin-inline-end: 4px;
}

:deep(.p-multiselect-chip) {
  background-color: var(--primary-color) !important;
  color: white !important;
  border-radius: var(--radius-sm) !important;
  font-size: var(--size-xs) !important;
  border: none !important;
  gap: 4px;
}

:deep(.p-multiselect-chip-icon) {
  color: white !important;
  font-size: 10px !important;
}

/* selected items label (+N) */
:deep(.p-multiselect-label span) {
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-size: var(--size-xs);
}

/* placeholder */
:deep(.p-multiselect-placeholder) {
  color: var(--placeholder, #9ca3af) !important;
}

/* invalid */
:deep(.is-invalid.p-multiselect) {
  border-color: var(--danger-color, #dc3545) !important;
}

</style>