
<template>
  <aside>
    <CustomCard :title="title">
        <slot />
    </CustomCard>
  </aside>
</template>

<script setup>
import CustomCard from "../Cards/CustomCard.vue";
defineProps({
  title: {
    type: String,
    default: ""
  }
})
</script>

<style scoped>

</style>
