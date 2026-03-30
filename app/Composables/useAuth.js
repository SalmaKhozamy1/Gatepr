import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()
  const loading = ref(false)
  const error = ref(null)
  const api = useApi()
  const token = useCookie('token')
  const role = useCookie('role')
  const userCookie = useCookie('user')  // ✅

  const localePath = useLocalePath()

  // ✅ user بيجي من الـ cookie مباشرة
  const user = computed(() => userCookie.value || null)

  // 🔴 Logout
  const logout = async () => {
    const currentRole = role.value
    const logoutEndpoint = currentRole === 'supplier' ? '/logout' : '/v1/admin/logout'

    try {
      await api(logoutEndpoint, {
        method: 'POST'
      })
    } catch (err) {
      console.error('Logout error:', err)
    }

    // Clear cookies
    token.value = null
    userCookie.value = null
    role.value = null
    
    // Redirect based on role
    if (currentRole === 'supplier') {
      return navigateTo(localePath('/login/supplier'))
    } else {
      return navigateTo(localePath('/login/admin'))
    }
  }

  return {
    user,
    loading,
    error,
    logout
  }
}