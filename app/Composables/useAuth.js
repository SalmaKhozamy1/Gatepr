import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const api = useApi()
  const token = useCookie('token')

  // Login function
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await api('/admin/login', {
        method: 'POST',
        body: { email, password }
      })

      // Save token (Nuxt cookie is better than localStorage for SSR)
      token.value = response.data.token

      // Save user info
      user.value = response.data.user || null
      router.push('/')
    } catch (err) {
      error.value = err.data?.message || err.message
      console.error('Auth Error:', err)
    } finally {
      loading.value = false
    }
  }
  // 🔴 Logout
  const logout = async () => {
    try {
      await api('/v1/admin/logout', {
        method: 'POST'
      })
    } catch (err) {
      console.error('Logout error:', err)
    }

    // حذف التوكين
    token.value = null
    user.value = null

    router.push('/login/admin')
  }
  return {
    user,
    loading,
    error,
    login,
    logout
  }
}