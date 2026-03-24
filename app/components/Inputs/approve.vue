<template>
  <label class="approve-checkbox" :for="id">
    <input
      type="checkbox"
      :id="id"
      :checked="isChecked"
      @change="handleChange"
    />
    <span class="checkmark position-relative"></span>
    <span v-if="label" class="approve-label">{{ label }}</span>
    <span v-if="error" class="error d-block" style="margin-inline-start: 10px">{{ error }}</span>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Boolean, Array],
    default: false
  },
  value: {
    type: [String, Number, Object],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return props.modelValue
})

const handleChange = (event) => {
  const checked = event.target.checked
  
  if (Array.isArray(props.modelValue)) {
    let newValue = [...props.modelValue]
    if (checked) {
      if (!newValue.includes(props.value)) {
        newValue.push(props.value)
      }
    } else {
      newValue = newValue.filter(item => item !== props.value)
    }
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', checked)
  }
}
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
  transform: rotate(45deg) translate(-1.5px, -1.5px);
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