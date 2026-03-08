<template>
  <div class="custom-card">
    <div v-if="title || $slots.header || $slots.actions" class="card-header flex-between">
      <slot name="header">
        <h4 class="mb-0">{{ title }}</h4>
      </slot>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      default: ""
    }
  });
</script>
  
<style scoped>
 .custom-card {
    background-color: #fff;
    border-radius: var(--radius-md);
  }
  .custom-card .card-header {
    padding: 16px;
    border-bottom: 1px solid #F4F5F6;
    text-align: start;
  }
  .custom-card .card-content {
    padding: 16px;
  }
</style>
