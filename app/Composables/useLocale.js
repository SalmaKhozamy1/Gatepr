export const useLocale = () => {
  const api = useApi()
  const { locale, setLocale } = useI18n()
  const localeCookie = useCookie('locale', {
    maxAge: 60 * 60 * 24 * 365,
    path: '/'
  })

  const changeLocale = async (newLocale) => {
    try {
      // ✅ حفظ الـ cookie الأول عشان الـ plugin يقراه
      localeCookie.value = newLocale

      // ✅ غيّر الـ locale في الـ i18n
      await setLocale(newLocale)

      // ✅ ابعت للـ API عشان يتحفظ في الـ server
      const res = await api('/change-locale', {
        method: 'POST',
        body: { locale: newLocale }
      })

      return res.data?.locale || newLocale

    } catch (err) {
      // ✅ لو الـ API فشلت اللغه بتفضل متغيرة محلياً
      console.error('Locale API error:', err)
      return newLocale
    }
  }

  return { changeLocale, currentLocale: locale }
}