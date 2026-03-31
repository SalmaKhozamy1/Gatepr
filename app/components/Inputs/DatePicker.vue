<template>
  <div class="form-group custom-datepicker">
    <label v-if="label" class="form-label ms-1 fs-14 fw-medium text-dark-blue">{{ label }}</label>
    <div class="position-relative">
      <FlatPickr
        v-model="date"
        :placeholder="placeholder"
        class="form-control flatpickr-input"
        :config="flatpickrConfig"
        :class="{ 'is-invalid': error }"
      />
      <IconsCalander class="calendar-icon" width="18" height="18" />
    </div>
    <span v-if="error" class="error d-block fs-13 mt-1 text-danger">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FlatPickr from 'vue-flatpickr-component'
import { Arabic } from 'flatpickr/dist/l10n/ar.js'

const { t, locale } = useI18n()

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Date, Array], default: null },
  placeholder: { type: String, default: 'YYYY-MM-DD' },
  error: { type: String, default: '' },
  dateFormat: { type: String, default: 'Y-m-d' }
})

const emit = defineEmits(['update:modelValue'])

const date = ref(props.modelValue)

const flatpickrConfig = computed(() => ({
  dateFormat: props.dateFormat,
  locale: locale.value === 'ar' ? Arabic : 'default',
  allowInput: true,
  disableMobile: "true"
}))

watch(() => props.modelValue, (newVal) => {
  date.value = newVal
})

watch(date, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style scoped>
.calendar-icon {
  position: absolute;
  top: 50%;
  inset-inline-end: 12px;
  transform: translateY(-50%);
  color: #98A2B3;
  pointer-events: none;
}
.flatpickr-input {
  padding-inline-end: 35px !important;
}
</style>
