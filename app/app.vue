<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
  const { locale } = useI18n()
  const head = useLocaleHead({
    addDirAttribute: true,
    identifierAttribute: 'id',
    addSeoAttributes: true
  })

  useHead({
    htmlAttrs: computed(() => head.value.htmlAttrs),
  })
</script>