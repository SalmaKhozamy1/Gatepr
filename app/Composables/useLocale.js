export const useLocale = () => {
  const api = useApi()
  const { locale, setLocale } = useI18n()
  
  // ✅ نفس الـ options بالظبط زي app.vue
  const localeCookie = useCookie('locale', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    default: () => 'ar'
  })

  const initLocale = async () => {
    const savedLocale = localeCookie.value
    if (savedLocale && savedLocale !== locale.value) {
      await setLocale(savedLocale)
    }
  }

  const changeLocale = async (newLocale) => {
    try {
      localeCookie.value = newLocale
      await setLocale(newLocale)

      await api('/change-locale', {
        method: 'POST',
        body: { locale: newLocale }
      })

      return newLocale
    } catch (err) {
      console.error('Locale API error:', err)
      return newLocale
    }
  }

  return { changeLocale, initLocale, currentLocale: locale }
}