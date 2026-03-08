<template>
  <label class="toggle-switch">
    <input 
      type="checkbox" 
      :checked="modelValue" 
      @change="$emit('update:modelValue', $event.target.checked)"
    >
    <span class="slider round"></span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #E2E8F0;
  transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  bottom: 3px;
  background-color: white;
  transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* RTL Support via general sibling pseudo-class or attribute selectors is common, assuming app uses [dir="rtl"] on body/html */
html[dir="rtl"] .slider:before,
[dir="rtl"] .slider:before {
  right: 3px;
}

html[dir="ltr"] .slider:before,
[dir="ltr"] .slider:before {
  left: 3px;
}

/* When checked */
input:checked + .slider {
  background-color: #12B76A; /* Green from the screenshot */
}

/* RTL checked */
html[dir="rtl"] input:checked + .slider:before,
[dir="rtl"] input:checked + .slider:before {
  transform: translateX(-20px);
  background-color: #ecfcf5;
}

/* LTR checked */
html[dir="ltr"] input:checked + .slider:before,
[dir="ltr"] input:checked + .slider:before {
  transform: translateX(20px);
  background-color: #ecfcf5;
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
