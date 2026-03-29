<template>
  <NuxtLayout>
    <AppToast />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { locale, setLocale } = useI18n()
const localeCookie = useCookie('locale', { 
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
  default: () => 'ar'
})

onMounted(() => {
  const saved = localeCookie.value
  if (saved && saved !== locale.value) {
    setLocale(saved)
  }
})


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