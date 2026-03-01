<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
  const isArabic = ref(true);
  useHead({
    htmlAttrs: {
      dir: computed(() => isArabic.value ? 'rtl' : 'ltr'),
      lang: computed(() => isArabic.value ? 'ar' : 'en')
    },
  })

</script>