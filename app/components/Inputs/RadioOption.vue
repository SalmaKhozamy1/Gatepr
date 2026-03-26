<template>
  <label class="radio-option flex-between gap-xs">
    <span class="radio_label">{{ label }}</span>
    <input type="radio" :value="value" :checked="modelValue === value"
     @change="$emit('update:modelValue', value)" />
    <div class="radio-custom flex-center">
      <div class="radio-checkmark"></div>
    </div>
  </label>
</template>

<script setup>
defineProps({
    label: String,
    value: String,
    modelValue: String,
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.radio-option  {
  border-radius: 8px;
  border: 1px solid var(--light-gray);
  padding: 12px;
}
.radio_label{
  font-size: var(--size-sm);
  font-weight: 400;
  color: var(--placeholder);
}
.radio-option input[type="radio"] {
  display: none;
}
.radio-custom {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--placeholder);
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;
}
.radio-option input[type="radio"]:checked + .radio-custom {
  background: var(--secondary-color);
  border-color: var(--secondary-color);
}
.radio-checkmark {
  display: none;
  width: 4px;
  height: 7px;
  border: 2px solid white;
  border-top: none;
  border-left: none;
  transform: rotate(45deg) translateY(-1px);
}
.radio-option input[type="radio"]:checked + .radio-custom .radio-checkmark {
  display: block;
}
.radio-option:has(input[type="radio"]:checked) {
  border-color: var(--secondary-color);
  background-color: var(--light-secondary-color);
}
.radio-option:has(input[type="radio"]:checked) .radio_label {
  color: var(--text-color);
}
</style>