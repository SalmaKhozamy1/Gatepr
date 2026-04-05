<script setup>
import { useSlots, computed, ref } from 'vue'
import { IconsEye, IconsEyeOff } from '#components'

const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  icon: { type: [Object, Function, String], default: null }
})

const emit = defineEmits(['update:modelValue'])

const slots = useSlots()
const hasSuffix = computed(() => !!slots.suffix)

const showPassword = ref(false)
const localType = computed(() => {
  if (props.type === 'password' && showPassword.value) return 'text'
  return props.type
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="form-group" :class="{ 'has-error': error }">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div class="input-wrapper position-relative">
      <input
        v-bind="$attrs"
        :type="localType"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        class="form-control w-100"
        :class="{ 
          'is-invalid': error, 
          'has-suffix': hasSuffix || type === 'password', 
          'has-icon': icon 
        }"
      >

      <!-- ✅ Password Eye Icon -->
      <div 
        v-if="type === 'password'" 
        class="password-toggle"
        @click="togglePassword"
      >
        <component :is="showPassword ? IconsEye : IconsEyeOff" width="18" height="18" />
      </div>

      <!-- ✅ Other Icon dynamic -->
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

<style scoped>
/* ✅ Icon styles */
.form-control.has-icon {
  padding-inline-end: 40px;
}

.input-icon, .password-toggle {
  position: absolute;
  inset-inline-end: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--placeholder);
  color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle {
  cursor: pointer;
  z-index: 5;
}

.password-toggle:hover {
  opacity: 0.8;
}

.form-control.has-suffix {
  padding-inline-end: 40px;
}
</style>