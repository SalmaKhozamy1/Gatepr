<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="form-select"
      :class="{ 'is-invalid': error }"
      v-bind="$attrs"
    >
      <option disabled value="" v-if="placeholder">{{ placeholder }}</option>
      <option 
        v-for="(option, index) in options" 
        :key="index" 
        :value="option.value || option"
      >
        {{ option.label || option }}
      </option>
    </select>
    <span v-if="error" class="error d-block">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'اختر'
  },
  error: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>
