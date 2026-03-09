// import { defineStore } from 'pinia'

// export const useAuthStore = defineStore('auth', {

//   state: () => ({
//     user: null
//   }),

//   actions: {
//     setUser(userData) {
//       this.user = userData
//     },

//     clearUser() {
//       this.user = null
//     }
//   }

// })

// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  const setUser = (userData) => {
    user.value = userData
  }

  const logout = () => {
    user.value = null
  }

  return { user, setUser, logout }
})