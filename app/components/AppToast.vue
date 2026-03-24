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
  bottom: 15px !important;
  top: unset !important;
  z-index: 99999 !important;
  width: max-content;
  transform: none !important;
  left: unset !important;
  right: unset !important;
}
[dir="rtl"] .p-toast {
  left: 2% !important;
}
[dir="ltr"] .p-toast {
  right: 2% !important;
}
.p-toast-message {
  border-radius: var(--radius-sm) !important;
  padding: 16px;
  margin-bottom: 5px !important;
  border: none !important;
}

.p-toast-message-content {
  gap: var(--gap-sm) !important;
}

.p-toast-message-success {
  background-color: var(--success-color) !important;
  color: #fff !important;
}

.p-toast-message-error {
  background-color: var(--red) !important;
  color: #fff !important;
}

.p-toast-message-warn {
  background-color: var(--warning) !important;
  color: #fff !important;
}

.p-toast-message-info {
  background-color: var(--primary-color) !important;
  color: #fff !important;
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