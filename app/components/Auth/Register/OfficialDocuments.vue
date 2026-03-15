<template>
  <div class="grid grid-3 gap-md">
    <!-- Section 1 -->
    <h5 class="secondary-title full-width">{{ t('labels.stamped_customs_declaration') }}</h5>
    <InputsFormInput v-model="s1_nameAr" :label="t('labels.name_ar')" :placeholder="t('placeholders.name_ar')" :error="errors.s1_nameAr"/>
    <InputsFormInput v-model="s1_nameEn" :label="t('labels.name_en')" :placeholder="t('placeholders.name_en')" :error="errors.s1_nameEn"/>
    <InputsFormInput v-model="s1_licenseNumber" :label="t('labels.license_number')" type="number" :placeholder="t('placeholders.license_number')" :error="errors.s1_licenseNumber"/>
    <InputsDatePicker v-model="s1_startDate" :label="t('labels.start_date')" :error="errors.s1_startDate"/>
    <InputsDatePicker v-model="s1_endDate" :label="t('labels.end_date')" :error="errors.s1_endDate"/>
    <InputsDatePicker v-model="s1_licenseExpiry" :label="t('labels.license_expiry')" :error="errors.s1_licenseExpiry"/>
    <div class="full-width">
      <InputsFileUploader accept=".pdf,.xml,.doc,.docx" accept-label="PDF , XML , Word" @update:files="s1_files = $event" />
    </div>

    <!-- Section 2 -->
    <h5 class="secondary-title full-width">{{ t('labels.import_license') }}</h5>
    <InputsFormInput v-model="s2_nameAr" :label="t('labels.name_ar')" :placeholder="t('placeholders.name_ar')" :error="errors.s2_nameAr"/>
    <InputsFormInput v-model="s2_nameEn" :label="t('labels.name_en')" :placeholder="t('placeholders.name_en')" :error="errors.s2_nameEn" />
    <InputsFormInput v-model="s2_licenseNumber" :label="t('labels.license_number')" type="number" :placeholder="t('placeholders.license_number')" :error="errors.s2_licenseNumber"/>
    <InputsDatePicker v-model="s2_startDate" :label="t('labels.start_date')" :error="errors.s2_startDate"/>
    <InputsDatePicker v-model="s2_endDate" :label="t('labels.end_date')" :error="errors.s2_endDate"/>
    <InputsDatePicker v-model="s2_licenseExpiry" :label="t('labels.license_expiry')" :error="errors.s2_licenseExpiry"/>
    <div class="full-width">
      <InputsFileUploader accept=".pdf,.xml,.doc,.docx" accept-label="PDF , XML , Word" @update:files="s2_files = $event" />
    </div>

    <!-- Section 3 -->
    <h5 class="secondary-title full-width">{{ t('labels.approved_agency_registration') }}</h5>
    <InputsFormInput v-model="s3_nameAr" :label="t('labels.name_ar')" :placeholder="t('placeholders.name_ar')" :error="errors.s3_nameAr"/>
    <InputsFormInput v-model="s3_nameEn" :label="t('labels.name_en')" :placeholder="t('placeholders.name_en')" :error="errors.s3_nameEn"/>
    <InputsFormInput v-model="s3_licenseNumber" :label="t('labels.license_number')" type="number" :placeholder="t('placeholders.license_number')" :error="errors.s3_licenseNumber"/>
    <InputsDatePicker v-model="s3_startDate" :label="t('labels.start_date')" :error="errors.s3_startDate" />
    <InputsDatePicker v-model="s3_endDate" :label="t('labels.end_date')" :error="errors.s3_endDate" />
    <InputsDatePicker v-model="s3_licenseExpiry" :label="t('labels.license_expiry')" :error="errors.s3_licenseExpiry" />
    <div class="full-width">
      <InputsFileUploader accept=".pdf,.xml,.doc,.docx" accept-label="PDF , XML , Word" @update:files="s3_files = $event" />
    </div>

    <InputsApprove v-model="agreed" :label="t('labels.agree_to_terms')" :error="errors.agreed" />
  </div>
</template>

<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const s1_files = ref([])
const s2_files = ref([])
const s3_files = ref([])

const schema = yup.object({
  s1_nameAr: yup.string().required(t('errors.isRequired', { name: t('labels.name_ar') })),
  s1_nameEn: yup.string().required(t('errors.isRequired', { name: t('labels.name_en') })),
  s1_licenseNumber: yup.string().required(t('errors.isRequired', { name: t('labels.license_number') })),
  s1_startDate: yup.string().required(t('errors.isRequired', { name: t('labels.start_date') })),
  s1_endDate: yup.string().required(t('errors.isRequired', { name: t('labels.end_date') })),
  s1_licenseExpiry: yup.string().required(t('errors.isRequired', { name: t('labels.license_expiry') })),

  s2_nameAr: yup.string().required(t('errors.isRequired', { name: t('labels.name_ar') })),
  s2_nameEn: yup.string().required(t('errors.isRequired', { name: t('labels.name_en') })),
  s2_licenseNumber: yup.string().required(t('errors.isRequired', { name: t('labels.license_number') })),
  s2_startDate: yup.string().required(t('errors.isRequired', { name: t('labels.start_date') })),
  s2_endDate: yup.string().required(t('errors.isRequired', { name: t('labels.end_date') })),
  s2_licenseExpiry: yup.string().required(t('errors.isRequired', { name: t('labels.license_expiry') })),

  s3_nameAr: yup.string().required(t('errors.isRequired', { name: t('labels.name_ar') })),
  s3_nameEn: yup.string().required(t('errors.isRequired', { name: t('labels.name_en') })),
  s3_licenseNumber: yup.string().required(t('errors.isRequired', { name: t('labels.license_number') })),
  s3_startDate: yup.string().required(t('errors.isRequired', { name: t('labels.start_date') })),
  s3_endDate: yup.string().required(t('errors.isRequired', { name: t('labels.end_date') })),
  s3_licenseExpiry: yup.string().required(t('errors.isRequired', { name: t('labels.license_expiry') })),
  
  agreed: yup.boolean().oneOf([true], t('validation.agree_to_terms_required')),
})

const { errors, validate } = useForm({
  validationSchema: schema,
})

const { value: s1_nameAr } = useField('s1_nameAr')
const { value: s1_nameEn } = useField('s1_nameEn')
const { value: s1_licenseNumber } = useField('s1_licenseNumber')
const { value: s1_startDate } = useField('s1_startDate')
const { value: s1_endDate } = useField('s1_endDate')
const { value: s1_licenseExpiry } = useField('s1_licenseExpiry')

const { value: s2_nameAr } = useField('s2_nameAr')
const { value: s2_nameEn } = useField('s2_nameEn')
const { value: s2_licenseNumber } = useField('s2_licenseNumber')
const { value: s2_startDate } = useField('s2_startDate')
const { value: s2_endDate } = useField('s2_endDate')
const { value: s2_licenseExpiry } = useField('s2_licenseExpiry')

const { value: s3_nameAr } = useField('s3_nameAr')
const { value: s3_nameEn } = useField('s3_nameEn')
const { value: s3_licenseNumber } = useField('s3_licenseNumber')
const { value: s3_startDate } = useField('s3_startDate')
const { value: s3_endDate } = useField('s3_endDate')
const { value: s3_licenseExpiry } = useField('s3_licenseExpiry')

const { value: agreed } = useField('agreed')

defineExpose({
  validate: async () => {
    const { valid } = await validate()
    return valid
  }
})
</script>

<style scoped>
.secondary-title {
  font-size: 16px;
  padding: 10px;
  background-color: var(--light-gray);
  border-radius: var(--radius-sm);
}
</style>
