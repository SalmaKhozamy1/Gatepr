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


