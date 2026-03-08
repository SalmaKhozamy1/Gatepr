<template>
  <label class="approve-checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="checkmark"></span>
    <span class="approve-label">{{ label }}</span>
    <span v-if="error" class="error d-block" style="margin-inline-start: 10px">{{ error }}</span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'أوافق علي الشروط والأحكام'
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.approve-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.approve-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.checkmark {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border: 2px solid #D0D5DD;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background-color: #fff;
}

/* Checked state */
.approve-checkbox input[type="checkbox"]:checked + .checkmark {
  border-color: var(--secondary-color);
  background-color: #fff;
}

/* Checkmark icon */
.checkmark::after {
  content: '';
  display: none;
  width: 6px;
  height: 10px;
  border: solid var(--secondary-color);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px, -1px);
}

.approve-checkbox input[type="checkbox"]:checked + .checkmark::after {
  display: block;
}

.approve-label {
  font-size: var(--size-sm);
  color: var(--text-color);
  font-weight: 400;
}
</style>