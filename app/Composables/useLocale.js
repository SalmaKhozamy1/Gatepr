export const useLocale = () => {
  const api = useApi()
  const { locale, setLocale } = useI18n()

  const changeLocale = async (newLocale) => {
    try {
      const res = await api('/change-locale', {
        method: 'POST',
        body: { locale: newLocale }
      })

      // ✅ يغير اللغة في الـ i18n
      await setLocale(res.data.locale)

      return res.data
    } catch (err) {
      throw err?.data?.message || err?.message || 'فشل تغيير اللغة'
    }
  }

  return { changeLocale, currentLocale: locale }
}