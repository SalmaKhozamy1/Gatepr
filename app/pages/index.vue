<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
const token = useCookie('token')
const role = useCookie('role')

onMounted(() => {
  // لو المستخدم مش عامل تسجيل دخول
  if (!token.value) {
    return navigateTo(localePath('/login/admin'))
  }

  // لو Admin
  if (role.value === 'admin') {
    return navigateTo(localePath('/admin/home'))
  }

  // لو User عادي
  return navigateTo(localePath('/admin/home'))
})
</script>

<template>
  <div class="redirect-page">
    <p>{{ t('buttons.redirecting') }}</p>
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