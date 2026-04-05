// composables/usePageMeta.js
export const usePageMeta = (titleKey) => {
  const { t } = useI18n()
  const route = useRoute()
  route.meta.title = titleKey
  
  useHead({
    title: computed(() => t(titleKey)),
  })
}