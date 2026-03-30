<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="var(--primary-color)" />
    <AppToast />
    
    <div v-if="isPageLoading" class="page-content">
      <PageLayoutAppSkeleton />
    </div>
    <NuxtPage v-else />
  </NuxtLayout>
</template>

<script setup>
const router = useRouter()
const isPageLoading = ref(false)

// Robust page transition handling
router.beforeEach((to, from) => {
  if (to.path !== from.path) {
    isPageLoading.value = true
  }
})

router.afterEach(() => {
  setTimeout(() => {
    isPageLoading.value = false
  }, 400) // ✅ Slight delay for a smoother skeleton presentation
})
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