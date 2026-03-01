<template>
  <div class="auth-wrapper">
    <div class="grid-2 min-vh-100 align-items-center g-0">
      <!-- Left Branding Side -->
      <div class="branding-container h-100 ">
        <div class="branding-card h-100 d-flex flex-column position-relative">
          <div class="top-actions position-fixed">
            <button class="lang-btn">
              <IconsLang />
            </button>
            <span class="lang-title flex-center">E</span>
          </div>
          
          <div class="logo-area flex-grow-1 d-flex align-items-center justify-content-center">
            <div class="logo-wrapper d-flex align-items-center gap-3">
              <img src="~/assets/images/login_logo.svg" alt="logo">
            </div>
          </div>
        </div>
      </div>

      <!-- Right Form Side -->
      <div class="form-container fle-center mx-auto w-100">
        <div class="auth-content w-100" :dir="'rtl'">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.auth-wrapper {
    background-color: #fff;
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
  top: 35px;
  inset-inline-start: 35px;
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
    inset-inline-start: 28px;
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
    padding-inline: 15%;
}
</style>

