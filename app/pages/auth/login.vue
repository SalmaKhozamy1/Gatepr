<template>
  <div class="login-page flex-column-start">
    <h2 class="auth-title w-100">تسجيل الدخول</h2>
    
    <form @submit.prevent="handleLogin" class="auth-form w-100">
      <InputsFormInput
        v-model="loginData.code"
        label="الكود"
        placeholder="ادخل الكود"
      />
      
      <InputsFormInput
        v-model="loginData.password"
        label="كلمة المرور"
        :type="showPassword ? 'text' : 'password'"
        placeholder="ادخل كلمة السر"
      >
        <template #suffix>
          <button type="button" class="password-toggle" @click="showPassword = !showPassword">
            <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </button>
        </template>
      </InputsFormInput>

      <div class="form-options d-flex justify-content-between align-items-center mb-4 mt-2">
        <div class="remember-me gap-2 d-flex align-items-center">
            <div class="custom-check border rounded p-1 d-flex align-items-center justify-content-center" style="width: 22px; height: 22px;">
               <input type="checkbox" id="remember" class="form-check-input m-0 opacity-0 position-absolute" style="width: 22px; height: 22px; cursor: pointer;">
               <div class="check-icon text-warning">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
               </div>
            </div>
            <label for="remember" class="text-muted small">تذكرني</label>
        </div>
        <a href="#" class="forgot-link text-muted small text-decoration-none">نسيت كلمة السر؟</a>
      </div>

      <button type="submit" class="warning-btn custom-btn w-100 py-3 shadow-sm border-0 text-white fw-bold mt-4">تسجيل الدخول</button>

      <div class="auth-footer text-center mt-5">
        <span class="text-muted small">ليس لدي حساب؟ </span>
        <nuxt-link to="/register" class="signup-link text-decoration-none small fw-bold">إنشاء حساب</nuxt-link>
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
});

const showPassword = ref(false);
const loginData = ref({
    code: '',
    password: ''
});

const handleLogin = () => {
    console.log('Login attempt:', loginData.value);
    navigateTo('/');
}
</script>

<style scoped>
.login-page {
  gap: 20px;
}
.auth-title {
  font-size: var(--size-md);
  font-weight: 600;
  color: var(--primary-color);
}


.password-toggle {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: #a0aec0;
  cursor: pointer;
}

.input-wrapper {
  position: relative;
}

.signup-link {
  color: #f5a623;
}

.warning-btn {
  background-color: #f5a623;
  border-radius: 12px;
  font-size: 16px;
}

.bg-light { background-color: #f7fafc !important; }
.text-muted { color: #718096 !important; }
.fw-bold { font-weight: 700 !important; }
.small { font-size: 12.5px; }
</style>
