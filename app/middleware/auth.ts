export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')
  const role = useCookie('role')

  // 1. If no token, redirect to appropriate login page
  if (!token.value) {
    const pathParts = to.path.split('/')
    const adminSegments = ['admin', 'settings', 'categories', 'suppliers', 'branches', 'activity_logs']
    const isAdminRoute = to.meta.adminOnly || adminSegments.some(s => pathParts.includes(s))
    
    return navigateTo(isAdminRoute ? '/login/admin' : '/login/supplier')
  }

  // 2. If it's an admin-only route, check the role
  if (to.meta.adminOnly && role.value !== 'admin') {
     return navigateTo('/home')
  }

  // 3. If it's a supplier-only route, check the role
  const pathParts = to.path.split('/')
  const supplierPaths = ['item-managment', 'terms-and-condition']
  
  // check if path starts with any supplier paths AND it's not the admin settings one
  const isSupplierPath = supplierPaths.some(p => pathParts.includes(p)) && !to.path.includes('/settings/')
  const isSupplierOnly = to.meta.supplierOnly || isSupplierPath
  
  if (isSupplierOnly && role.value !== 'supplier') {
     return navigateTo('/home')
  }
})

