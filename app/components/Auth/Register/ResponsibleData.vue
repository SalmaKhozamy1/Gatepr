<template>
  <div class="grid grid-3 gap-md">
      <InputsFormInput 
        v-model="phone" 
        :label="t('labels.supplier_phone')" 
        :placeholder="t('placeholders.supplier_phone')" 
        :error="errors.phone"
      />
      <InputsFormInput 
        v-model="mobile" 
        :label="t('labels.supplier_mobile')" 
        :placeholder="t('placeholders.supplier_mobile')" 
        :error="errors.mobile"
      />
      <InputsFormInput 
        v-model="fax" 
        :label="t('labels.fax')" 
        :placeholder="t('placeholders.fax')" 
        :error="errors.fax"
      />
      
      <InputsFormInput 
        v-model="email" 
        :label="t('labels.email')" 
        :placeholder="t('placeholders.email')" 
        :error="errors.email"
      />
      <InputsFormInput 
        v-model="address" 
        :label="t('labels.detailed_address')" 
        :placeholder="t('placeholders.detailed_address')" 
        :error="errors.address"
      />
      <InputsFormInput 
        v-model="website" 
        :label="t('labels.website')" 
        :placeholder="t('placeholders.website_url')" 
        :error="errors.website"
      />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:valid'])

const schema = yup.object({
  phone: yup.string()
  .required(t('errors.isRequired', { name: t('labels.supplier_phone') }))
  .test('no-text', t('validation.no_text'), value => /^[0-9+\-().'\s]+$/.test(value || '')),
  mobile: yup.string()
  .required(t('errors.isRequired', { name: t('labels.supplier_mobile') }))
  .test('no-text', t('validation.no_text'), value => /^[0-9+\-().'\s]+$/.test(value || '')),
  fax: yup.string()
  .required(t('errors.isRequired'))
  .test('no-text', t('validation.no_text'), value => /^[0-9+\-().'\s]+$/.test(value || '')),
  email: yup.string().required(t('validation.email_required')).email(t('validation.email_invalid')),
  address: yup.string().required(t('errors.isRequired', { name: t('labels.detailed_address') })),
  website: yup.string().url(t('errors.website')).required(t('errors.isRequired')),
})

const { errors, validate, meta, setErrors } = useForm({
  validationSchema: schema,
  initialValues: props.initialData || {}
})

watch(() => meta.value.valid, (newVal) => {
  emit('update:valid', newVal)
}, { immediate: true })

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
  },
  setErrors: (errs) => {
     setErrors(errs)
  },
  getValues: () => {
    return {
      phone: phone.value,
      mobile: mobile.value,
      fax: fax.value,
      email: email.value,
      address: address.value,
      website: website.value
    }
  }
})
</script>

<style scoped>
@media (max-width: 767px) { .grid-3 { grid-template-columns: 1fr; } }
</style>
