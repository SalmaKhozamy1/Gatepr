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

      if (token.value) {
        options.headers.Authorization = `Bearer ${token.value}`
      }

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