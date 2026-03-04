import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Login function
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch(`${config.public.apiBase}/v1/admin/login`, {
        method: 'POST',
        body: { email, password }
      })
      // Save token
      localStorage.setItem('token', response.access_token)

      // Save user info
      user.value = response.user || null
      router.push('/')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
}