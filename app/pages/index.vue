<script setup>
const token = useCookie('token')
const role = useCookie('role')

onMounted(() => {
  // لو المستخدم مش عامل تسجيل دخول
  if (!token.value) {
    return navigateTo('/auth/login')
  }

  // لو Admin
  if (role.value === 'admin') {
    return navigateTo('/admin/home')
  }

  // لو User عادي
  return navigateTo('/profile')
})
</script>

<template>
  <div class="redirect-page">
    <p>جاري التحويل...</p>
  </div>
</template>

<style scoped>
.redirect-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
}
</style>