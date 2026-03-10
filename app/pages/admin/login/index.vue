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
        <InputsApprove :label="$t('labels.rememberMe')" />
        <a href="#" class="forgot-link custom-anc">{{ $t('buttons.forgotYourPassword') }}</a>
      </div>

      <button type="submit" class="custom-btn secondary-btn w-100">{{ $t('buttons.login') }}</button>

    </form>

    <div class="auth-footer w-100 flex-center gap-xs">
      <h5>{{ $t('labels.dontHaveAccount') }}</h5>
      <nuxt-link to="/register" class="signup-link custom-anc secondary">{{ $t('buttons.signUp') }}</nuxt-link>
    </div>

  </div>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '~/stores/auth'
definePageMeta({
  layout: 'auth'
});

const showPassword = ref(false);
/* API */
const api = useApi()
const token = useCookie('token')
 
const authStore = useAuthStore()
const { t } = useI18n()

/* 1️⃣ Schema */
const schema = computed(() => {
  return yup.object({
    email: yup.string()
    .required(t('errors.isRequired', { name: t('labels.email') }))
    .email(t('errors.emailFormat')),
    password: yup.string()
    .required(t('errors.isRequired', { name: t('labels.password') }))
    .min(6, t('errors.min', { name: t('labels.password'), num: 6 }))
  })
})

/* 2️⃣ useForm */
const { handleSubmit, errors} = useForm({
  validationSchema: schema
})

/* 3️⃣ useField */
const { value: email } = useField('email');
const { value: password } = useField('password');

/* 4️⃣ Submit */
const onSubmit = handleSubmit(async (values) => {
  try {

    //  بعد كده اعمل login
    const response = await api('/admin/login', {
      method: 'POST',
      body: {
        email: values.email,
        password: values.password
      }
    })

    // 3️⃣ حفظ التوكن بعد نجاح login
    token.value = response.data.token

    authStore.setUser(response.data.user)
    
    console.log("user:" , response.data.user);
    console.log("token.value:" , token.value);
    
    // 4️⃣ تحويل للصفحة الرئيسية
    navigateTo('/admin/home')
  } catch (error) {
    console.error('Login Error:', error)
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
</style>
