export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('token')

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    async onRequest({ options }) {
      options.headers = {
        ...options.headers,
        Accept: 'application/json, text/plain, */*',
        'X-Requested-With': 'XMLHttpRequest'
      }

      if (options.body && !options.headers['Content-Type']) {
        options.headers['Content-Type'] = 'application/json'
      }

      // ارسال التوكن لو موجود
      if (token.value) {
        options.headers.Authorization = `Bearer ${token.value}`
      }

      // لو فيه CSRF token في meta
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      if (csrfToken) {
        options.headers['X-CSRF-TOKEN'] = csrfToken
      }

      // مهم جدا للكوكيز
      options.credentials = 'include'
    }
  })

  return api
}