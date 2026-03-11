<template>
  <div class="auth-wrapper">
    <div class="grid grid-2 min-vh-100 align-items-center g-0">
      <!-- Right Form Side -->
      <div class="form-container flex-center mx-auto w-100">
        <div class="auth-content w-100">
          <slot />
        </div>
      </div>
      <!-- Left Branding Side -->
      <div class="branding-container h-100 py-2">
        <div class="branding-card h-100 d-flex flex-column position-relative">
          <div class="top-actions position-absolute">
            <button class="lang-btn" @click="toggleLocale">
              <IconsLang />
            </button>
            <span class="lang-title flex-center">{{ currentLocale === 'ar' ? 'ع' : 'E' }}</span>
          </div>
          
          <div class="logo-area flex-grow-1 flex-center">
            <div class="logo-wrapper d-flex align-items-center gap-3">
              <img src="~/assets/images/login_logo.svg" alt="logo" class="w-100">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const { changeLocale, currentLocale } = useLocale()

  const toggleLocale = async () => {
    await changeLocale(currentLocale.value === 'ar' ? 'en' : 'ar')
  }
</script>

<style scoped>
.auth-wrapper {
    background-color: #fff;
}
.logo-wrapper {
  min-height: 340px;
  max-width: 200px;
}
.auth-wrapper .grid-2 {
  padding: 12px;
}
.branding-container {
  padding-block: 10%;
  background-color: var(--primary-color);
  border-radius: var(--radius-lg);
}
.top-actions {
  top: clamp(10px,2%,2%);
  inset-inline-end: clamp(20px,4%,4%);
}
.lang-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}
.lang-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
.lang-title {
    position: absolute;
    inset-inline-end: 28px;
    top: -8px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: var(--secondary-color);
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    pointer-events: none;
}
.form-container  {
    padding-inline: clamp(20px, 6.8vw, 300px);
}

@media screen and (max-width: 576px) {
  .branding-container {
    order: -1;
  }
  .form-container {
    padding-block: 40px;
  }
  .form-container  {
    padding-inline: clamp(20px, 3vw, 300px);
  }
}
</style>

