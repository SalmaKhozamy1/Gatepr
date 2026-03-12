<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <MultiSelect
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      :class="['w-100', { 'is-invalid': error }]"
      display="chip"
      :filter="true"
      filter-placeholder="بحث..."
      empty-message="لا توجد خيارات"
      empty-filter-message="لا توجد نتائج"
      append-to="body"
      :max-selected-labels="2"
      selected-items-label="{0} عناصر محددة"
    />
    <span v-if="error" class="error d-block">{{ error }}</span>
  </div>
</template>

<script setup>
import MultiSelect from 'primevue/multiselect'

defineProps({
  label: { type: String, default: '' },
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'اختر' },
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Root */
:deep(.p-multiselect) {
  width: 100%;
  font-family: inherit !important;
  font-size: var(--size-sm) !important;
  direction: rtl;
  border-radius: var(--radius-sm) !important;
  border: 1px solid var(--border-color, #e0e0e0) !important;
  box-shadow: none !important;
  min-height: 40px;
}

:deep(.p-multiselect:hover) {
  border: 1px solid var(--border-color, #e0e0e0) !important;
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