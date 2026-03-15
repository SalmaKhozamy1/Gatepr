<template>
  <Toast position="top-center">
    <template #message="{ message }">
      <div class="flex-start gap-sm w-100">
        <IconsCheck v-if="message.severity === 'success'" width="20" height="20" />
        <IconsCross v-else-if="message.severity === 'error'" width="20" height="20" />
        <div class="flex-column">
          <span v-if="message.detail" class="toast-detail">{{ message.detail }}</span>
        </div>
      </div>
    </template>
  </Toast>
</template>

<script setup>
import Toast from 'primevue/toast'
import { IconsCheck, IconsCross } from '#components' 
</script>

<style>
.p-toast {
  bottom: 20px !important;
  top: unset !important;
  inset-inline-end: 10% !important;
  z-index: 99999 !important;
}

.p-toast-message {
  border-radius: var(--radius-sm) !important;
  padding: 16px;
  margin-bottom: 0px !important;
}

.p-toast-message-content {
  gap: var(--gap-sm) !important;
}

.p-toast-message-success {
  background-color: var(--success-color) !important;
  color: #fff !important;
  border: none !important;
}

.p-toast-message-error {
  background-color: color-mix(in srgb, var(--danger-color, #ef4444) 10%, white) !important;
  border-color: var(--danger-color, #ef4444) !important;
}

.p-toast-message-warn {
  background-color: color-mix(in srgb, var(--warning-color, #f59e0b) 10%, white) !important;
  border-color: var(--warning-color, #f59e0b) !important;
}

.p-toast-message-info {
  background-color: color-mix(in srgb, var(--primary-color) 10%, white) !important;
  border-color: var(--primary-color) !important;
}

.p-toast-close-button {
  display: none !important;
}

.toast-detail {
  font-weight: 500;
  font-size: 16px !important;
  color: inherit;
}
</style>