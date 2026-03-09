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
        class="form-control w-100"
        :class="{ 'is-invalid': error }"
      >
      <slot name="suffix" />
    </div>
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
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.required .form-label::after {
    content: "*";
    color: var(--red);
    margin-inline-start: 5px;
}
</style>


