
<template>
  <main>
     <cards-custom-card :title="Title">
        <template #actions v-if="$slots.actions">
          <slot name="actions" />
        </template>
        <slot />
     </cards-custom-card>
  </main>
</template>

<script setup>
defineProps({
  Title: {
    type: String,
    default: ""
  }
})
</script>

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
