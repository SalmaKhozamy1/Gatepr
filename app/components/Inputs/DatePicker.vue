<template>
  <div class="form-group custom-datepicker">
    <label v-if="label" class="form-label ms-1 fs-14 fw-medium text-dark-blue">{{ label }}</label>
    <div class="input-wrapper position-relative">
      <DatePicker
        v-model="date"
        :dateFormat="dateFormat"
        :placeholder="placeholder"
        :class="{ 'p-invalid': error }"
        fluid
        showIcon
        iconDisplay="input"
      >
        <template #inputicon>
          <IconsCalander class="p-datepicker-filter-icon calendar-custom-icon" />
        </template>
      </DatePicker>
    </div>
    <span v-if="error" class="error d-block fs-13 mt-1 text-danger">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Date, Array], default: null },
  placeholder: { type: String, default: 'YYYY-MM-DD' },
  error: { type: String, default: '' },
  dateFormat: { type: String, default: 'yy-mm-dd' }
})

const emit = defineEmits(['update:modelValue'])

const date = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  date.value = newVal
})

watch(date, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style scoped>
/* Main Wrapper Styling */
.custom-datepicker :deep(.p-datepicker) {
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #eef0f2;
  font-family: 'Tajawal', sans-serif;
  overflow: hidden;
}

/* Input Field Styling */
.custom-datepicker :deep(.p-inputtext) {
  width: 100%;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid #ced4da;
  font-size: 15px;
  background-color: #fff;
  transition: all 0.25s ease;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.custom-datepicker :deep(.p-inputtext:focus) {
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(var(--secondary-color-rgb), 0.15);
  outline: none;
}

.custom-datepicker :deep(.p-inputtext.p-invalid) {
  border-color: #ef4444;
  background-color: #fef2f2;
}

/* Header Styling */
.custom-datepicker :deep(.p-datepicker-header) {
  background: var(--secondary-color);
  color: #fff;
  padding: 12px 14px;
}

.custom-datepicker :deep(.p-datepicker-header .p-datepicker-title) {
    display: flex;
    gap: 8px;
    align-items: center;
}

.custom-datepicker :deep(.p-datepicker-header .p-datepicker-title .p-datepicker-month),
.custom-datepicker :deep(.p-datepicker-header .p-datepicker-title .p-datepicker-year) {
  color: #fff;
  font-weight: 600;
  font-size: 15px;
}

.custom-datepicker :deep(.p-datepicker-header .p-link) {
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  transition: background 0.2s;
}

.custom-datepicker :deep(.p-datepicker-header .p-link:hover) {
  background: rgba(255, 255, 255, 0.2);
}

/* Calendar Body Styling */
.custom-datepicker :deep(.p-datepicker-calendar td) {
    padding: 2px;
}

.custom-datepicker :deep(.p-datepicker-calendar td > span) {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
}

.custom-datepicker :deep(.p-datepicker-calendar td > span.p-highlight) {
  background: var(--secondary-color);
  color: #fff;
  box-shadow: 0 4px 10px rgba(var(--secondary-color-rgb), 0.3);
}

.custom-datepicker :deep(.p-datepicker-calendar td > span:not(.p-highlight):not(.p-disabled):hover) {
  background: #f1f5f9;
  color: var(--secondary-color);
}

/* Icon Support */
.calendar-custom-icon {
  width: 18px;
  height: 18px;
  color: #94a3b8;
}

.custom-datepicker :deep(.p-datepicker-trigger-icon) {
    color: #94a3b8;
}

/* Helpers */
.fs-14 { font-size: 14px; }
.text-dark-blue { color: #1e293b; }
.fs-13 { font-size: 13.5px; }

/* RTL Fine-tuning */
[dir="rtl"] .custom-datepicker :deep(.p-inputtext) {
    padding-left: 40px; /* Space for icon if needed */
}

[dir="rtl"] .custom-datepicker :deep(.p-datepicker-header .p-datepicker-prev) {
    order: 2;
}
[dir="rtl"] .custom-datepicker :deep(.p-datepicker-header .p-datepicker-next) {
    order: 0;
}
</style>
