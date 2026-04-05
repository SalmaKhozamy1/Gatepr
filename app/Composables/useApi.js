export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    async onRequest({ options }) {
      const { $i18n } = useNuxtApp()
      const localeValue = $i18n.locale.value || 'ar'

      const headers = {
        Accept: 'application/json, text/plain, */*',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Language': localeValue,
        ...options.headers
      }

      if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json'
      }

      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }
      
      options.headers = headers

      if (import.meta.client) {
        const csrfToken = useCookie('XSRF-TOKEN').value 
          || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

        if (csrfToken) {
          options.headers['X-CSRF-TOKEN'] = csrfToken
          options.headers['X-XSRF-TOKEN'] = csrfToken
        }
      }

      options.credentials = 'include'
    }
  })

  return api
}