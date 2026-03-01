<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="input-wrapper position-relative">
      <input
        v-bind="$attrs"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="form-control"
      >
      <slot name="suffix" />
    </div>
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
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
label.form-label {
  font-size: var(--size-sm);
  font-weight: 500;
  margin-bottom: 8px;
}
input.form-control {
  border-radius: var(--radius-sm);
  padding: var(--form-control-padding);
  border: 1px solid #E0E1E5;
  background-color: #fff;
}
.form-control:focus {
    background-color: #f8f9fa !important;
    box-shadow: none;
    border: 1px solid var(--secondary-color) !important;
}
</style>
