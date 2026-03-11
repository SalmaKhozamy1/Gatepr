// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {

  const user = ref(null)

  const setUser = (userData) => {
    user.value = userData
  }

  const logout = () => {
    const token = useCookie('token')

    user.value = null
    token.value = null
  }

  return {
    user,
    setUser,
    logout
  }
})