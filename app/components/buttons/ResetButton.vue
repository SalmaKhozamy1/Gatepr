<template>
  <button type="button" class="custom-btn text-btn nowrap fltr_btn reset_btn" @click="$emit('reset')">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M23 4v6h-6"></path>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
    <span><slot>{{ t('pages.reset') }}</slot></span>
  </button>
</template>

<script setup>
defineEmits(['reset'])
const { t } = useI18n()
</script>

<style scoped>
.fltr_btn {
  min-height: 42.5px;
}
.reset_btn {
  color: var(--placeholder);
  border-color: var(--placeholder);
}
</style>
