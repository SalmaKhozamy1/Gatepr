<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="form-select"
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
  }
});

defineEmits(['update:modelValue']);
</script>
