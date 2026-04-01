<template>
  <label class="approve-checkbox" :for="id" :class="{ 'disabled-label': disabled }">
    <input
      type="checkbox"
      :id="id"
      :checked="isChecked"
      :disabled="disabled"
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
  },
  disabled: {
    type: Boolean,
    default: false
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
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  position: relative;
  margin-bottom: 8px;
}

.disabled-label {
  cursor: default;
  opacity: 0.7;
}

.approve-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
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
  margin-top: 2px;
}

/* Checked state */
.approve-checkbox input[type="checkbox"]:checked + .checkmark {
  border-color: var(--secondary-color);
  background-color: var(--secondary-color);
}

/* Checkmark icon */
.checkmark::after {
  content: '';
  display: none;
  width: 6px;
  height: 11px;
  border: solid #fff;
  border-width: 0 2.5px 2.5px 0;
  transform: rotate(45deg);
  margin-bottom: 3px;
}

.approve-checkbox input[type="checkbox"]:checked + .checkmark::after {
  display: block;
}

.approve-label {
  font-size: var(--size-sm);
  color: var(--text-color);
  font-weight: 400;
  line-height: normal;
}
</style>