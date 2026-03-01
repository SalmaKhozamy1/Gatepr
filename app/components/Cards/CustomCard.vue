<template>
  <div class="custom-card">
    <div v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <h4>{{ title }}</h4>
      </slot>
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
