<template>
  <div class="form-group" :class="{ 'has-error': error }">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="input-wrapper position-relative">
      <input
        v-bind="$attrs"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="form-control w-100"
        :class="{ 'is-invalid': error, 'has-suffix': hasSuffix, 'has-icon': icon }"
      >

      <!-- ✅ Icon dynamic -->
      <component
        v-if="icon && typeof icon !== 'string'"
        :is="icon"
        class="input-icon"
      />
      <span
        v-if="icon && typeof icon === 'string'"
        class="input-icon"
      >{{ icon }}</span>

      <slot name="suffix" />
    </div>
    <span v-if="error" class="error d-block">{{ error }}</span>
  </div>
</template>

<script setup>
import { useSlots, computed } from 'vue'

const slots = useSlots()
const hasSuffix = computed(() => !!slots.suffix)

defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  icon: { type: [Object, Function, String], default: null }  // ✅
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.required .form-label::after {
  content: "*";
  color: var(--red);
  margin-inline-start: 5px;
}

.form-control.is-invalid {
  padding-inline-end: 40px !important;
}

.form-control.is-invalid.has-suffix {
  padding-inline-end: 75px !important;
}

/* ✅ Icon styles */
.form-control.has-icon {
  padding-inline-end: 40px;
}

.input-icon {
  position: absolute;
  inset-inline-end: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--placeholder);
  pointer-events: none;
  color: var(--secondary-color);
}
</style>