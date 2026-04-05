export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')
  const role = useCookie('role')

  if (!token.value) {
    return navigateTo('/login/admin')
  }

  if (role.value !== 'admin') {
     // If user is logged in as supplier but tries to access admin settings
     return navigateTo('/home')
  }
})
