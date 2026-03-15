<template>
  <div>
    <div class="grid grid-3 gap-md">
        <InputsFormInput 
          v-model="nameAr" 
          :label="t('labels.company_name_ar')" 
          :placeholder="t('placeholders.company_name_ar')" 
          :error="errors.nameAr"
        />
        <InputsFormInput 
          v-model="nameEn" 
          :label="t('labels.company_name_en')" 
          :placeholder="t('placeholders.company_name_en')" 
          :error="errors.nameEn"
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

const { errors, validate } = useForm({
  validationSchema: schema,
})

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
  }
})
</script>

<style scoped>
.fw-600 { font-weight: 600; }
</style>
