
// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const userCookie = useCookie('user', { watch: true, default: () => null })
  const user = ref(userCookie.value)

  const setUser = (userData) => {
    user.value = userData
    userCookie.value = userData
  }

  const logout = () => {
    user.value = null
    userCookie.value = null
  }

  return { user, setUser, logout }
})