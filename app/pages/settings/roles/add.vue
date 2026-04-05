<template>
  <RolesRoleForm
    mode="create"
    v-model:selectedPermissions="selectedPermissions"
    v-model:roleData="roleData"
    :permissionGroups="permissionGroups"
    :loading="loading"
    :errors="formErrors"
    @save="handleSave"
    @cancel="handleCancel"
    @blur-name="handleBlurName"
  />
</template>

<script setup>
definePageMeta({ fullPage: true, middleware: 'auth', adminOnly: true })

import { ref, computed, onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'
import { useI18n } from 'vue-i18n'

const api = useApi()
const localePath = useLocalePath()
const { t } = useI18n()
const { success: toastSuccess, error: toastError } = useAppToast()

const permissionGroups = ref([])
const selectedPermissions = ref([])
const loading = ref(false)

/* =============================
   VALIDATION SCHEMA
============================== */
const schema = computed(() => yup.object({
  name_ar: yup
    .string()
    .required(t('errors.isRequired', { name: t('labels.name_ar') }))
    .test('no-english', t('validation.arabic_only'), value => !/[a-zA-Z]/.test(value || ''))
    .min(2, t('errors.min', { name: t('labels.name_ar'), num: 2 }))
    .max(100, t('errors.max', { num: 100 })),
  name_en: yup
    .string()
    .required(t('errors.isRequired', { name: t('labels.name_en') }))
    .test('no-arabic', t('validation.english_only'), value => !/[ء-ي]/.test(value || ''))
    .min(2, t('errors.min', { name: t('labels.name_en'), num: 2 }))
    .max(100, t('errors.max', { num: 100 })),
}))

const { handleSubmit, setErrors, errors } = useForm({
  validationSchema: schema,
  validateOnMount: false,
  validateOnInput: true,
  validateOnChange: true,
  validateOnBlur: true,    
  validateOnModelUpdate: true,
})

const { value: nameAr, handleBlur: blurAr } = useField('name_ar')
const { value: nameEn, handleBlur: blurEn } = useField('name_en')

/* =============================
   roleData مربوط بالـ fields
============================== */
const roleData = computed({
  get: () => ({
    name: {
      ar: nameAr.value || '',
      en: nameEn.value || '',
    }
  }),
  set: (val) => {
    nameAr.value = val.name.ar
    nameEn.value = val.name.en
  }
})

/* =============================
   ERRORS مربوطة بالـ vee-validate
============================== */
const formErrors = computed(() => ({
  'name.ar': errors.value.name_ar,
  'name.en': errors.value.name_en,
}))

/* =============================
   FETCH PERMISSIONS
============================== */
const fetchPermissions = async () => {
  try {
    const res = await api('/v1/admin/permissions')
    permissionGroups.value = res.data || []
  } catch (err) {
    console.error(err)
  }
}

/* =============================
   SAVE
============================== */
const handleSave = handleSubmit(async () => {
  try {
    loading.value = true

    await api('/v1/admin/roles', {
      method: 'POST',
      body: {
        name: {
          ar: nameAr.value,
          en: nameEn.value,
        },
        permissions: selectedPermissions.value
      }
    })

    toastSuccess(t('messages.added_successfully', { item: t('labels.role') }))
    navigateTo(localePath('/settings/roles'))

  } catch (err) {
    // ✅ أخطاء الـ backend
    if (err?.data?.errors) {
      const backendErrors = {}
      Object.entries(err.data.errors).forEach(([key, messages]) => {
        // backend بيبعت name.ar و name.en فبنحولهم لـ vee-validate keys
        if (key === 'name.ar') backendErrors.name_ar = messages[0]
        else if (key === 'name.en') backendErrors.name_en = messages[0]
        else backendErrors[key] = messages[0]
      })
      setErrors(backendErrors)
    } else {
      toastError(err?.data?.message || t('common.somethingWentWrong'))
    }
  } finally {
    loading.value = false
  }
})

/* =============================
   CANCEL
============================== */
const handleCancel = () => {
  navigateTo(localePath('/settings/roles'))
}

const handleBlurName = (lang) => {
  if (lang === 'ar') blurAr()
  else if (lang === 'en') blurEn()
}

/* =============================
   LIFECYCLE
============================== */
onMounted(() => fetchPermissions())
</script>
