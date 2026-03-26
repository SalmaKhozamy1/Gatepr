export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('token')
  const role = useCookie('role')

  if (token.value) {
    if (role.value === 'supplier') {
      return navigateTo('/home')
    }
    return navigateTo('/')
  }
})