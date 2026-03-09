<template>
  <div class="statistics-card flex-start gap-md">
     <div class="card-icon flex-center" :style="{backgroundColor: IconBg}">
        <slot name="icon" />
     </div>
     <div class="card-title flex-column-start">
        <h3>{{ CardNo }}</h3>
        <p class="desc">{{ title }}</p>
     </div>
  </div>
</template>

<script setup>
  defineProps({
    CardNo: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ""
    },
    IconBg: {
      type: String,
      default: "#64CBF4"
    }
  });
</script>
  
<style scoped>
  .statistics-card {
    padding: 12px;   
    background: var(--light-primary-color);  
    border-radius: var(--radius-md);  
  }
  .card-icon {
    border-radius: var(--radius-sm);
    width: 48px;
    height: 48px;   
    color: #fff;
  }
</style>
