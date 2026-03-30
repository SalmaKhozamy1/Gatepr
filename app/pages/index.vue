<template>

</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});
onMounted(async () => {
  return navigateTo('/home')
})
</script>