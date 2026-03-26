<template>
  <div class="login-page flex-column-start">
    <h2 class="auth-title w-100">{{ $t('auth.loginTitle') }}</h2>
    
    <form @submit="onSubmit" class="auth-form w-100 flex-column-start gap-sm">
      <InputsFormInput
        v-model="code"
        :label="$t('labels.code')"
        :placeholder="$t('placeholders.code')"
        :error="errors.code"
      />
      
      <InputsFormInput
        v-model="password"
        :label="$t('labels.password')"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="$t('placeholders.password')"
        :error="errors.password"
      >
        <template #suffix>
          <button type="button" class="password-toggle icon" @click="showPassword = !showPassword">
            <IconsEye v-if="showPassword" width="24" height="24" />
            <IconsEyeOff v-else width="24" height="24" />
          </button>
        </template>
      </InputsFormInput>

      <div class="form-options flex-between w-100 mb-2">
        <InputsApprove v-model="rememberMe" id="rememberMe" :label="$t('labels.rememberMe')" />
        <a href="#" class="forgot-link custom-anc" @click.prevent="showChangePasswordModal = true">{{ $t('buttons.forgotYourPassword') }}</a>
      </div>

      <button type="submit" class="custom-btn secondary-btn w-100">{{ $t('buttons.login') }}</button>

    </form>

    <div class="auth-footer w-100 flex-center gap-xs">
      <h5>{{ $t('labels.dontHaveAccount') }}</h5>
      <nuxt-link to="/register" class="signup-link custom-anc secondary">{{ $t('buttons.signUp') }}</nuxt-link>
    </div>

  </div>

  <!-- ✅ Modals -->
  <ModalsChangePasswordWay 
    v-model:show="showChangePasswordModal" 
    @open-reset-password="handleOpenResetPassword" 
  />

  <ModalsResetPasswordModal 
    v-model:show="showResetPasswordModal" 
    :contact="resetContact"
    :type="contactType"
    :code="resetCode"
    :token="resetToken"
    resetEndpoint="/reset-password"
  />
</template>

<script setup>
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
});
usePageMeta('menu.login')

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '~/stores/auth'
import { computed } from 'vue'

const { t } = useI18n()
const localePath = useLocalePath()
const api = useApi()
const token = useCookie('token')
const role = useCookie('role')
const authStore = useAuthStore()
const { error: toastError } = useAppToast()

// Modal State
const showChangePasswordModal = ref(false)
const showResetPasswordModal = ref(false)
const resetContact = ref('')
const contactType = ref('email')
const resetCode = ref('')
const resetToken = ref('')

const showPassword = ref(false);
const rememberMe = ref(false);

/* 1️⃣ Schema (Computed for reactive translations) */
const schema = computed(() => {
  return yup.object({
    code: yup.string()
      .required(t('validation.code_required')),
    password: yup.string()
      .required(t('validation.password_required'))
      .min(6, t('validation.password_min'))
  })
})

/* 2️⃣ useForm */
const { handleSubmit, errors, setErrors } = useForm({
  validationSchema: schema
})

/* 3️⃣ useField */
const { value: code } = useField('code');
const { value: password } = useField('password');

/* 4️⃣ Submit */
const onSubmit = handleSubmit(async (values) => {
  if (values.code === '1111' && values.password === '123456') {
    token.value = 'temp-token'
    role.value = 'supplier'
    authStore.setUser({ name: 'Test User', code: '1111' })
    navigateTo(localePath('/home'))
    return
  }

  try {
    const response = await api('/login', {
      method: 'POST',
      body: {
        code: values.code,
        password: values.password
      }
    })

    // 3️⃣ حفظ التوكن بعد نجاح login
    token.value = response.data.token
    role.value = 'supplier'
    
    // حفظ بيانات المورد (تكون عادةً في response.data.supplier)
    authStore.setUser(response.data.supplier?.[0] || response.data.supplier)

    // 4️⃣ تحويل للصفحة الرئيسية
    navigateTo(localePath('/home'))
  } catch (err) {
    console.error('Supplier Login Error:', err)
    
    if (err.data?.errors) {
      setErrors(err.data.errors)
    }
    
    const isGenericError = !err.data?.errors && (err.statusCode === 401 || err.statusCode === 422)
    toastError(isGenericError ? t('messages.invalid_login') : (err.data?.message || t('common.somethingWentWrong')))
  }
})

const handleOpenResetPassword = (data) => {
  resetContact.value = data.contact
  contactType.value = data.type
  resetCode.value = data.code
  resetToken.value = data.token || ''
  showResetPasswordModal.value = true
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
  inset-inline-end: 15px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: #a0aec0;
}

.signup-link {
  color: var(--secondary-color);
}

.forgot-link {
 color: var(--text-color);
 font-size: var(--size-sm);
 font-weight: 400;
}
</style>
