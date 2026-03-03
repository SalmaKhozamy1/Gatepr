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
import 'flatpickr/dist/flatpickr.css';
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
})

watch(() => props.modelValue, (newVal) => {
  date.value = newVal
})

watch(date, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style scoped>
input.form-control {
  cursor: pointer;
  padding-inline-end: 40px;
  background-color: #fff !important;
}
.calendar-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  inset-inline-end: var(--form-control-padding);
  pointer-events: none;
  color: var(--placeholder);
}

/* Flatpicker style */
.input_flat_picker {
  border-radius: var(--raduis-sm) !important;
  padding: var(--form-control-padding);
  border: 1px solid #d5d7da;
  background-color: #fff !important;
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
.board-clip.input-icon {
  top: 46px !important;
}
.single-upload:has(label) .input-icon {
  position: absolute;
  top: 50% !important;
  inset-inline-end: 12px !important;
  transform: translate(0px, -50%) !important;
  color: var(--secondery-color);
  height: max-content;
}
/* .form-group > .flat_picker_icon {
    top: 12px !important;
    transform: translate(0%, 0%) !important;
} */
.dropdown-center .input-icon{
  top: unset !important;
  bottom: 0px !important;
}
.input-icon {
  cursor: pointer;
  z-index: 111;
}
/* header */
.flatpickr-months {
  background-color: var(--secondery-color);
  padding: 5px 8px;
  color: #fff;
  border-top-left-radius: var(--raduis-md);
  border-top-right-radius: var(--raduis-md);
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
  background-color: var(--secondery-color) !important;
  border-radius: 50% !important;
}
.flatpickr-months .flatpickr-prev-month:hover svg, .flatpickr-months .flatpickr-next-month:hover svg {
  fill: rgb(187, 186, 186) !important;
}
.flatpickr-day.today ,
.flatpickr-day.today:hover {
  color: var(--secondery-color) !important;
  background: var(--light-secondary-color) !important;
}
</style>
