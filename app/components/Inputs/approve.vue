<template>
  <label class="approve-checkbox" :for="id">
    <input
      type="checkbox"
      :checked="isChecked"
      :id="id"
      @change="handleChange"
    />
    <span class="checkmark"></span>
    <span class="approve-label">{{ label }}</span>
    <span v-if="error" class="error d-block" style="margin-inline-start: 10px">{{ error }}</span>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Boolean, Array],  // ✅ يدعم Boolean و Array
    default: false
  },
  value: {
    type: [String, Number],  // ✅ الـ value اللي هتتضاف للـ array
    default: null
  },
  label: {
    type: String,
    default: 'أوافق علي الشروط والأحكام'
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

// ✅ بيشوف هل الـ value موجودة في الـ array أو الـ Boolean صح
const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return props.modelValue
})

const handleChange = (event) => {
  if (Array.isArray(props.modelValue)) {
    const newValue = [...props.modelValue]
    if (event.target.checked) {
      if (!newValue.includes(props.value)) {
        newValue.push(props.value)
      }
    } else {
      const index = newValue.indexOf(props.value)
      if (index !== -1) newValue.splice(index, 1)
    }
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', event.target.checked)
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