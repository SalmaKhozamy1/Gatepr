<template>
  <NuxtLayout>
    <AppToast />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { locale, setLocale } = useI18n()
const localeCookie = useCookie('locale', { path: '/' })

onMounted(() => {
  if (localeCookie.value && localeCookie.value !== locale.value) {
    setLocale(localeCookie.value)
  }
})

// ✅ مراقبة تغيير اللغة للتأكد من حفظها في الـ Cookie دائماً
watch(locale, (newVal) => {
  if (localeCookie.value !== newVal) {
    localeCookie.value = newVal
  }
}, { immediate: true })

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})

useHead({
  htmlAttrs: computed(() => head.value.htmlAttrs),
})
</script>