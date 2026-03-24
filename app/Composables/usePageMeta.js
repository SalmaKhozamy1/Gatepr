// composables/usePageMeta.js
export const usePageMeta = (titleKey) => {
  const { t } = useI18n()
  useHead({
    title: computed(() => t(titleKey)),
  })
}