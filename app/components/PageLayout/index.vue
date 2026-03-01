<template>
  <div class="side-page-layout grid grid-2 gap-md">
      <page-layout-aside-content>
           <slot />
      </page-layout-aside-content>
      <page-layout-main-content>
           <slot />
      </page-layout-main-content>
  </div>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    default: () => []
  },
  currentStep: {
    type: Number,
    default: 0
  }
});

defineEmits(['step-change']);
</script>

<style scoped>
.side-page-layout {
  grid-template-columns: .5fr 1fr;
}

/* Responsive handling */
@media (max-width: 576px) {
  .side-page-layout {
    grid-template-columns: 100%;
  }
}
</style>
