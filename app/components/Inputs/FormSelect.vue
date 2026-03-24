<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <Select
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      :options="normalizedOptions"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      :class="['w-100', { 'is-invalid': error }]"
      :filter="options.length > 5"
      filter-placeholder="بحث..."
      empty-message="لا توجد خيارات"
      empty-filter-message="لا توجد نتائج"
      append-to="body"
    />
    <span v-if="error" class="error d-block">{{ error }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number, Object], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'اختر' },
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

// Normalize options so that an array of plain strings is mapped to { label, value } correctly
const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        label: opt.label || opt.name || String(opt),
        value: opt.value !== undefined ? opt.value : opt
      }
    }
    return { label: String(opt), value: opt }
  })
})
</script>

<style scoped>
/* Root */
:deep(.p-select) {
  width: 100%;
  font-size: var(--size-sm) !important;
  border-radius: var(--radius-sm) !important;
  border: 1px solid #e0e0e0 !important;
  box-shadow: none !important;
  min-height: 40px;
}

:deep(.p-select:focus) {
  border-color: var(--secondary-color) !important;
  box-shadow: none;
  outline: none !important;
}

:deep(.p-select-placeholder) {
  color: var(--placeholder, #9ca3af) !important;
  font-weight: 400;
}

/* dropdown icon */
:deep(.p-select-dropdown) {
  width: 2.5rem;
  color: var(--placeholder, #9ca3af);
}

/* invalid */
:deep(.is-invalid.p-select) {
  border-color: var(--danger-color, #dc3545) !important;
}
</style>