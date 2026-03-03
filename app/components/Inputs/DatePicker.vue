<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="input-wrapper position-relative">
      <client-only>
        <flat-pickr
          v-model="date"
          :config="config"
          class="form-control"
          :placeholder="placeholder"
        />
      </client-only>
      <div class="calendar-icon">
        <IconsCalander />
      </div>
    </div>
  </div>
</template>

<script setup>
import flatPickr from 'vue-flatpickr-component';
import { ref, watch } from 'vue';

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Date], default: null },
  placeholder: { type: String, default: 'اختر' }
})

const emit = defineEmits(['update:modelValue'])
const date = ref(props.modelValue)

const config = ref({
  disableMobile: "true",
  dateFormat: 'Y-m-d',
  allowInput: true
})

watch(() => props.modelValue, (newVal) => {
  date.value = newVal
})

watch(date, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style>

.calendar-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  inset-inline-end: var(--form-control-padding);
  pointer-events: none;
  color: var(--placeholder);
}
.input-icon ,
.flat_picker_icon {
  position: absolute;
  top: 21px;
  inset-inline-end: 12px;
  transform: translate(0px, -50%);
  color: var(--secondery-color);
  height: max-content;
}

/* header */
.flatpickr-months {
  background-color: var(--secondary-color);
  padding: 5px 8px;
  color: #fff;
  border-top-left-radius: var(--radius-sm);
  border-top-right-radius: var(--radius-sm);
}
.flatpickr-months .flatpickr-prev-month:hover svg, 
.flatpickr-months .flatpickr-next-month:hover svg {
  fill: #fff !important;
}
.flatpickr-prev-month,
.flatpickr-next-month {
  position: static !important;
  text-align: center;
  display: flex;
  fill: #fff !important;
  color: #fff !important;
  font-weight: 800;
  font-size: 20px;
}
.flatpickr-current-month {
  display: flex !important;
  gap: 10%;
  align-items: center;
  justify-content: center;
  width: 100% !important;
  right: unset !important;
  left: unset !important;
  padding: 0px 30px !important;
}
.numInputWrapper,
.flatpickr-monthDropdown-months {
  width: 45% !important;
}
.numInput.cur-year {
  direction: ltr !important;
  color: #fff !important;
}
select.flatpickr-monthDropdown-months {
  color: #fff !important;
}
select.flatpickr-monthDropdown-months option {
  color: #1b1b1b !important;
}
select.flatpickr-monthDropdown-months:hover,
.numInputWrapper:hover {
  background-color: transparent !important;
}
/* calendar body */
.calendar-toolbar {
  background: #fff;
  border-radius: var(--raduis-md);
  padding: 16px;
}
.flatpickr-day {
  border-radius: 50% !important;
  border: 0px !important;
  padding: 0px !important;
}
.flatpickr-day:hover {
  background-color: var(--light-secondary-color) !important;
}
.flatpickr-day.selected {
  background-color: var(--secondary-color) !important;
  color: #fff;
  border-radius: 50% !important;
}
.flatpickr-months .flatpickr-prev-month:hover svg, .flatpickr-months .flatpickr-next-month:hover svg {
  fill: rgb(187, 186, 186) !important;
}
.flatpickr-day.today ,
.flatpickr-day.today:hover {
  color: var(--secondary-color) !important;
  background: var(--light-secondary-color) !important;
}
</style>
