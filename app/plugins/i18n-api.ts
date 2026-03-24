
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  const i18n = nuxtApp.$i18n as any
  const api = useApi()

  // ✅ fetch translations from API on init
  // const loadTranslations = async () => {
  //   try {
  //     const res = await api('/v1/admin/translations') as any
      
  //     if (res && res.data) {
  //       Object.entries(res.data).forEach(([lang, messages]) => {
  //         i18n.setLocaleMessage(lang, messages)
  //       })
  //     }
  //   } catch (err) {
  //     console.error('Failed to load translations from API:', err)
  //   }
  // }

  // await loadTranslations()
})
