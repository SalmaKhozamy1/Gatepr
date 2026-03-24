<template>
  <div class="redirect-page">
    <!-- Loader بدل النص -->
    <div class="loader-container">
      <div class="spinner"></div>
      <p>{{ t('buttons.redirecting') }}</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'empty'  // ← layout بدون header
})

const { t } = useI18n()
const localePath = useLocalePath()
const token = useCookie('token')
const role = useCookie('role')

onMounted(() => {
  if (!token.value) {
    return navigateTo(localePath('/login/admin'))
  }

  if (role.value === 'admin') {
    return navigateTo(localePath('/admin/home'))
  }

  return navigateTo(localePath('/admin/home'))
})
</script>

<style scoped>
.redirect-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top-color: var(--primary-color, #6366f1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loader-container p {
  font-size: 16px;
  color: #888;
  font-weight: 400;
}
</style>