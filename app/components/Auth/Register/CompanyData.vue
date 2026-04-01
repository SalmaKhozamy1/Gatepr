<template>
  <div>
    <div class="grid grid-3 gap-md">
        <InputsFormInput 
          v-model="nameAr" 
          :label="t('labels.company_name_ar')" 
          :placeholder="t('placeholders.company_name_ar')" 
          :error="errors.nameAr"
          class="required"
        />
        <InputsFormInput 
          v-model="nameEn" 
          :label="t('labels.company_name_en')" 
          :placeholder="t('placeholders.company_name_en')" 
          :error="errors.nameEn"
          class="required"
        />
        <InputsDatePicker 
          v-model="licenseStart" 
          :label="t('labels.license_start')" 
          :placeholder="t('placeholders.select')" 
          :error="errors.licenseStart"
        />
        
        <InputsFormInput 
          v-model="licenseNumber" 
          :label="t('labels.license_number')" 
          :placeholder="t('placeholders.license_number')" 
          :error="errors.licenseNumber"
        />
        <InputsFormInput 
          v-model="supplierDeputy" 
          :label="t('labels.supplier_deputy')" 
          :placeholder="t('placeholders.supplier_deputy')" 
          :error="errors.supplierDeputy"
        />
        <InputsDatePicker 
          v-model="licenseEnd" 
          :label="t('labels.license_end')" 
          :placeholder="t('placeholders.select')" 
          :error="errors.licenseEnd"
        />

        <InputsFormSelect 
            v-model="supplierType"
            :label="t('labels.event_type')" 
            :placeholder="t('placeholders.supplier_type')" 
            :options="['Type 1', 'Type 2']" 
            :error="errors.supplierType"
        />
        <InputsDatePicker 
          v-model="healthLicenseEnd" 
          :label="t('labels.health_license_end')" 
          :placeholder="t('placeholders.select')" 
          :error="errors.healthLicenseEnd"
        />
        <InputsDatePicker 
          v-model="industrialLicenseEnd" 
          :label="t('labels.industrial_license_end')" 
          :placeholder="t('placeholders.select')" 
          :error="errors.industrialLicenseEnd"
        />

    <div class="full-width">
          <InputsFormInput 
            v-model="password" 
            :label="t('labels.password')" 
            :placeholder="t('placeholders.password')" 
            type="password" 
            :error="errors.password"
          />
    </div>

    <!-- Upload Section -->
    <div class="full-width grid grid-2 gap-md">
        <InputsFileUploader
          :label="t('labels.industry_authority_cert')"
          accept=".pdf,.xml,.doc,.docx"
          accept-label="PDF , XML , Word"
          @update:files="generalIndustryFiles = $event"
        />

        <InputsFileUploader
          :label="t('labels.industrial_facility_cert')"
          accept=".pdf,.xml,.doc,.docx"
          accept-label="PDF , XML , Word"
          @update:files="facilityFiles = $event"
        />
    </div>

  </div>
  </div>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:valid'])

const generalIndustryFiles = ref([])
const facilityFiles = ref([])

const schema = yup.object({
  nameAr: yup.string().required(t('errors.isRequired', { name: t('labels.company_name_ar') })),
  nameEn: yup.string().required(t('errors.isRequired', { name: t('labels.company_name_en') })),
  licenseStart: yup.string().required(t('errors.isRequired', { name: t('labels.license_start') })),
  licenseNumber: yup.string().required(t('errors.isRequired', { name: t('labels.license_number') })),
  supplierDeputy: yup.string().required(t('errors.isRequired', { name: t('labels.supplier_deputy') })),
  licenseEnd: yup.string().required(t('errors.isRequired', { name: t('labels.license_end') })),
  supplierType: yup.string().required(t('errors.isRequired', { name: t('labels.event_type') })),
  healthLicenseEnd: yup.string().required(t('errors.isRequired', { name: t('labels.health_license_end') })),
  industrialLicenseEnd: yup.string().required(t('errors.isRequired', { name: t('labels.industrial_license_end') })),
  password: yup.string().required(t('validation.password_required')).min(6, t('validation.password_min')),
})

const { errors, validate, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    nameAr: props.initialData?.['name[ar]'] || '',
    nameEn: props.initialData?.['name[en]'] || '',
    licenseStart: props.initialData?.['license_start_date'] || '',
    licenseNumber: props.initialData?.['commercial_register'] || '',
    supplierDeputy: props.initialData?.['deputy_manager_name'] || '',
    licenseEnd: props.initialData?.['license_end_date'] || '',
    supplierType: props.initialData?.['supplier_type_id'] === 1 ? 'Type 1' : '', // Map back if possible
    healthLicenseEnd: props.initialData?.['health_license_expiry'] || '',
    industrialLicenseEnd: props.initialData?.['industrial_license_expiry'] || '',
    password: props.initialData?.['password'] || '',
  }
})

watch(() => meta.value.valid, (newVal) => {
  emit('update:valid', newVal)
}, { immediate: true })

const { value: nameAr } = useField('nameAr')
const { value: nameEn } = useField('nameEn')
const { value: licenseStart } = useField('licenseStart')
const { value: licenseNumber } = useField('licenseNumber')
const { value: supplierDeputy } = useField('supplierDeputy')
const { value: licenseEnd } = useField('licenseEnd')
const { value: supplierType } = useField('supplierType')
const { value: healthLicenseEnd } = useField('healthLicenseEnd')
const { value: industrialLicenseEnd } = useField('industrialLicenseEnd')
const { value: password } = useField('password')

defineExpose({
  validate: async () => {
    const { valid } = await validate()
    return valid
  },
  getValues: () => {
    return {
      nameAr: nameAr.value,
      nameEn: nameEn.value,
      commercial_register: licenseNumber.value,
      license_start_date: licenseStart.value,
      license_end_date: licenseEnd.value,
      health_license_expiry: healthLicenseEnd.value,
      industrial_license_expiry: industrialLicenseEnd.value,
      deputy_manager_name: supplierDeputy.value,
      password: password.value,
      supplier_type_id: 1, // default or map from supplierType.value
      general_industry_certificate: generalIndustryFiles.value?.[0], 
      industrial_establishment_certificate: facilityFiles.value?.[0]
    }
  }
})
</script>

<style scoped>
.fw-600 { font-weight: 600; }
</style>
