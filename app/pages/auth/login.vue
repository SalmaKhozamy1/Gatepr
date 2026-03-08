<template>
  <div class="login-page flex-column-start">
    <h2 class="auth-title w-100">تسجيل الدخول</h2>
    
    <form @submit="onSubmit" class="auth-form w-100 flex-column-start gap-sm">
      <InputsFormInput
        v-model="code"
        label="رقم الكود"
        type="text"
        placeholder="ادخل رقم الكود"
        :error="errors.code"
      />
      
      <InputsFormInput
        v-model="password"
        label="كلمة المرور"
        :type="showPassword ? 'text' : 'password'"
        placeholder="ادخل كلمة المرور"
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
        <InputsApprove label="تذكرني" />
        <a href="#" class="forgot-link custom-anc">نسيت كلمة السر؟</a>
      </div>

      <button type="submit" class="custom-btn secondary-btn w-100">تسجيل الدخول</button>

    </form>

    <div class="auth-footer w-100 flex-center gap-xs">
      <h5>ليس لدي حساب؟ </h5>
      <nuxt-link to="/register" class="signup-link custom-anc secondary">إنشاء حساب</nuxt-link>
    </div>

  </div>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
  layout: 'auth'
});

const showPassword = ref(false);

const token = useCookie('token')
const role = useCookie('role')

/* 1️⃣ Schema */
const schema = yup.object({
  code: yup.string()
  .required('رقم الكود مطلوب'),
  password: yup.string()
  .required('كلمة المرور مطلوبة')
})

/* 2️⃣ useForm */
const { handleSubmit, errors} = useForm({
  validationSchema: schema
})

/* 3️⃣ useField */
const { value: code } = useField('code');
const { value: password } = useField('password');

/* 4️⃣ Submit */
const onSubmit = handleSubmit((values) => {
  console.log('Login Values:', values)
  
  token.value = 'mock-token-value'
  role.value = 'admin'

  navigateTo('/admin/home')
})
</script>
