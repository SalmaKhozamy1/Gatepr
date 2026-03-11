// composables/useLocale.js
import { useApi } from '@/Composables/useApi'

export const useLocale = () => {
  const api = useApi()

  // دالة لتغيير اللغة
  const changeLocale = async (locale) => {
    if (!['en', 'ar'].includes(locale)) {
      throw new Error('Locale غير مسموح به')
    }

    const res = await api('/admin/change-locale', {
      method: 'POST',
      body: { locale }
    })

    return res.data // ترجع locale الجديد
  }

  return { changeLocale }
}