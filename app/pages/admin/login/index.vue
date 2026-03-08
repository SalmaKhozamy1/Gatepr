<template>
  <div class="login-page flex-column-start">
    <h2 class="auth-title w-100">تسجيل الدخول</h2>
    
    <form @submit="onSubmit" class="auth-form w-100 flex-column-start gap-sm">
      <InputsFormInput
        v-model="email"
        label="البريد الإلكتروني"
        type="email"
        placeholder="ادخل البريد الإلكتروني"
        :error="errors.email"
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
import { useApi } from '~/composables/useApi'
definePageMeta({
  layout: 'auth'
});

const showPassword = ref(false);
/* API */
const api = useApi()
const token = useCookie('token')

/* 1️⃣ Schema */
const schema = yup.object({
  email: yup.string()
  .required('البريد الإلكتروني مطلوب')
  .email('البريد الإلكتروني غير صحيح'),
  password: yup.string()
  .required('كلمة المرور مطلوبة')
  .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
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
    // 1️⃣ جلب CSRF cookie من السيرفر قبل أي POST
    await $fetch('https://gate.roqay.dev/sanctum/csrf-cookie', {
      credentials: 'include' // مهم عشان الكوكيز تتبعت
    })

    // 2️⃣ بعد كده اعمل login
    const response = await api('/v1/admin/login', {
      method: 'POST',
      body: {
        email: values.email,
        password: values.password
      }
    })

    // 3️⃣ حفظ التوكن بعد نجاح login
    token.value = response.data.token

    // 4️⃣ تحويل للصفحة الرئيسية
    navigateTo('/')
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
  color: #f5a623;
}

.forgot-link {
 color: var(--text-color);
 font-size: var(--size-sm);
 font-weight: 400;
}
</style>
