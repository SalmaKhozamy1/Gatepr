<script setup lang="ts">
import CustomCard from '../Cards/CustomCard.vue';

</script>

<template>
  <main>
     <custom-card>
        main
     </custom-card>
  </main>
</template>

<style scoped>
.main-column {
  flex: 1;
  min-width: 0;
}

.content-card {
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  padding: var(--gap-lg);
  min-height: 600px;
}
</style>
