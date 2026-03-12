<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="select-wrapper">
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
      <!-- ✅ arrow -->
      <span class="select-arrow">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    <span v-if="error" class="error d-block">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'اختر' },
  error: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper .form-select {
  appearance: none; 
  -webkit-appearance: none;
  padding-inline-end: 2rem;  
  padding-inline-start: 0.75rem;
  width: 100%;
  cursor: pointer;
}

.select-arrow {
  position: absolute;
  inset-inline-end: 0.75rem; 
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;  
  color: var(--placeholder, #9ca3af);
  display: flex;
  align-items: center;
}
</style>