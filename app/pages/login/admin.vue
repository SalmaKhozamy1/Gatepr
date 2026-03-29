<template>
  <div class="login-page flex-column-start">
    <h2 class="auth-title w-100">{{ $t('auth.loginTitle') }}</h2>
    
    <form @submit="onSubmit" class="auth-form w-100 flex-column-start gap-sm">
      <InputsFormInput
        v-model="email"
        :label="$t('labels.email')"
        type="email"
        :placeholder="$t('placeholders.email')"
        :error="errors.email"
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
        <a href="#" class="forgot-link custom-anc">{{ $t('buttons.forgotYourPassword') }}</a>
      </div>

      <button 
        type="submit" 
        class="custom-btn secondary-btn w-100"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="spinner" />
        <span v-else>{{ $t('buttons.login') }}</span>
      </button>

    </form>
  </div>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '~/stores/auth'
import { computed, ref } from 'vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
});
usePageMeta('menu.login')

const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)

const api = useApi()
const token = useCookie('token')
const role = useCookie('role')
const userCookie = useCookie('user')

const authStore = useAuthStore()
const { t } = useI18n()
const localePath = useLocalePath()
const { error: toastError } = useAppToast()

const schema = computed(() =>
  yup.object({
    email: yup.string()
      .required(t('validation.email_required'))
      .email(t('validation.email_invalid')),
    password: yup.string()
      .required(t('validation.password_required'))
      .min(6, t('validation.password_min'))
  })
)

const { handleSubmit, errors, setErrors } = useForm({
  validationSchema: schema
})

const { value: email } = useField('email')
const { value: password } = useField('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true

    const response = await api('/v1/admin/login', {
      method: 'POST',
      body: {
        email: values.email,
        password: values.password
      }
    })

    token.value = response.data.token
    role.value = 'admin'
    userCookie.value = response.data.user
    authStore.setUser(response.data.user)

    navigateTo(localePath('/'))

  } catch (err) {
    console.error('Login Error:', err)
    if (err.data?.errors) setErrors(err.data.errors)
    const isGenericError = !err.data?.errors && (err.statusCode === 401 || err.statusCode === 422)
    toastError(isGenericError ? t('messages.invalid_login') : (err.data?.message || t('common.somethingWentWrong')))
  } finally {
    isLoading.value = false
  }
})
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

/* Loading Spinner */
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.custom-btn:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}
</style>