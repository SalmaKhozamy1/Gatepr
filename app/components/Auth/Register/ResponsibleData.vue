<template>
  <div class="grid grid-3 gap-md">
      <InputsFormInput 
        v-model="phone" 
        label="تليفون المورد" 
        placeholder="ادخل تليفون المورد" 
        :error="errors.phone"
      />
      <InputsFormInput 
        v-model="mobile" 
        label="موبايل المورد" 
        placeholder="ادخل موبايل المورد" 
        :error="errors.mobile"
      />
      <InputsFormInput 
        v-model="fax" 
        label="الفاكس" 
        placeholder="ادخل الفاكس" 
        :error="errors.fax"
      />
      
      <InputsFormInput 
        v-model="email" 
        label="البريد الإلكتروني" 
        placeholder="ادخل البريد الإلكتروني" 
        :error="errors.email"
      />
      <InputsFormInput 
        v-model="address" 
        label="العنوان تفصيلي" 
        placeholder="ادخل العنوان التفصيلي" 
        :error="errors.address"
      />
      <InputsFormInput 
        v-model="website" 
        label="الموقع الإلكتروني" 
        placeholder="ادخل URL الموقع" 
        :error="errors.website"
      />
  </div>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  phone: yup.string().required('تليفون المورد مطلوب'),
  mobile: yup.string().required('موبايل المورد مطلوب'),
  fax: yup.string().optional(),
  email: yup.string().required('البريد الإلكتروني مطلوب').email('بريد إلكتروني غير صحيح'),
  address: yup.string().required('العنوان تفصيلي مطلوب'),
  website: yup.string().url('رابط غير صحيح').optional(),
})

const { errors, validate } = useForm({
  validationSchema: schema,
})

const { value: phone } = useField('phone')
const { value: mobile } = useField('mobile')
const { value: fax } = useField('fax')
const { value: email } = useField('email')
const { value: address } = useField('address')
const { value: website } = useField('website')

defineExpose({
  validate: async () => {
    const { valid } = await validate()
    return valid
  }
})
</script>

<style scoped>
@media (max-width: 767px) { .grid-3 { grid-template-columns: 1fr; } }
</style>
