import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()
  const loading = ref(false)
  const error = ref(null)
  const api = useApi()
  const token = useCookie('token')
  const userCookie = useCookie('user')  // ✅

  // ✅ user بيجي من الـ cookie مباشرة
  const user = computed(() => userCookie.value || null)

  // Login function
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await api('/admin/login', {
        method: 'POST',
        body: { email, password }
      })

      token.value = response.data.token
      userCookie.value = response.data.user || null  // ✅ خزّن في الـ cookie

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

    token.value = null
    userCookie.value = null  // ✅
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