
export default defineNuxtRouteMiddleware((to) => {
  // This middleware is no longer needed since we switched to prefix_except_default strategy.
  // The prefixing logic is now handled by Nuxt i18n automatically.
})
