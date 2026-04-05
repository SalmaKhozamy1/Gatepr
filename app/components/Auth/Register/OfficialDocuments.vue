<template>
  <div class="documents-wrapper flex-column gap-md">
    <div v-for="(doc, index) in officialDocsList" :key="doc.document_type" class="grid grid-3 gap-md">
      
      <h5 class="secondary-title full-width">{{ doc.labelAr }} / {{ doc.labelEn }}</h5>
      
      <InputsFormInput 
        v-model="doc.nameAr" 
        :label="t('labels.name_ar')" 
        :placeholder="t('placeholders.name_ar')" 
        :error="doc.nameArError"
        :class="{ 'required': index < 5 }"
      />
      <InputsFormInput 
        v-model="doc.nameEn" 
        :label="t('labels.name_en')" 
        :placeholder="t('placeholders.name_en')" 
        :error="doc.nameEnError"
        :class="{ 'required': index < 5 }"
      />
      <InputsFormInput 
        v-model="doc.license_number" 
        :label="t('labels.license_number')" 
        type="text" 
        :placeholder="t('placeholders.license_number')"
        :error="doc.licenseNumberError"
        :class="{ 'required': index < 5 }"
      />
      
      <InputsDatePicker 
        v-model="doc.start_date" 
        :label="t('labels.start_date')" 
        :error="doc.startDateError"
        :class="{ 'required': index < 5 }"
      />
      <InputsDatePicker 
        v-model="doc.end_date" 
        :label="t('labels.end_date')" 
        :error="doc.endDateError"
        :class="{ 'required': index < 5 }"
        :min-date="doc.start_date"
      />
      <InputsDatePicker 
        v-model="doc.license_expiry" 
        :label="t('labels.license_expiry')" 
        :error="doc.licenseExpiryError"
        :class="{ 'required': index < 5 }"
        :min-date="doc.start_date"
      />
      
      <div class="full-width">
        <InputsFileUploader 
          v-model="doc.file"
          :class="{ 'required': index < 5 }"
          :error="doc.fileError"
          accept=".pdf,.xml,.doc,.docx,.png,.jpg,.jpeg"
          accept-label="PDF , XML , Word , Images"
          @update:files="doc.file = $event"
        />
      </div>

      <div class="d-none">
        <InputsFormInput v-model="doc.document_type" />
      </div>
    </div>

    <!-- Agreement -->
    <div class="mt-3">
      <InputsApprove id="agree-terms" v-model="agreed" :label="t('labels.agree_to_terms')" :error="agreedError" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppToast } from '#imports'
import * as yup from 'yup'

const { t } = useI18n()
const { error: toastError } = useAppToast()

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:valid'])

// ============================================
// Documents
// ============================================
const documentEnums = [
  { type: 'custom_declaration',              ar: 'تصريح جمركي',                   en: 'Custom Declaration' },
  { type: 'import_license',                  ar: 'رخصة استيراد',                   en: 'Import License' },
  { type: 'agency_registration',             ar: 'تسجيل وكالة',                   en: 'Agency Registration' },
  { type: 'trademark_logo',                  ar: 'شعار تجاري',                     en: 'Trademark Logo' },
  { type: 'imported_food_certificate',       ar: 'شهادة استيراد أغذية',            en: 'Imported Food Certificate' },
  { type: 'union_circular',                  ar: 'تعميم الاتحاد',                  en: 'Union Circular' },
  { type: 'signature_approval',              ar: 'اعتماد توقيع',                   en: 'Signature Approval' },
  { type: 'commercial_license_copy',         ar: 'نسخة رخصة تجارية',              en: 'Commercial License Copy' },
  { type: 'chamber_certificate',             ar: 'شهادة الغرفة',                   en: 'Chamber Certificate' },
  { type: 'municipality_health_certificate', ar: 'شهادة صحية بلدية',              en: 'Municipality Health Certificate' },
  { type: 'industrial_authority_certificate',ar: 'شهادة الهيئة العامة للصناعة',  en: 'Industrial Authority Certificate' },
  { type: 'industrial_facility_certificate', ar: 'شهادة منشأة صناعية',            en: 'Industrial Facility Certificate' },
]

const officialDocsList = ref(documentEnums.map(doc => {
  const existing = props.initialData?.documents?.find(d => d.document_type === doc.type) || {}
  return {
    document_type:       doc.type,
    labelAr:             doc.ar,
    labelEn:             doc.en,
    nameAr:              existing.name?.ar       || doc.ar,
    nameEn:              existing.name?.en       || doc.en,
    license_number:      existing.license_number || '',
    start_date:          existing.start_date     || '',
    end_date:            existing.end_date       || '',
    license_expiry:      existing.license_expiry || '',
    file:                existing.file ? [existing.file] : [],
    // errors
    nameArError:         '',
    nameEnError:         '',
    licenseNumberError:  '',
    fileError:           '',
    startDateError:      '',
    endDateError:        '',
    licenseExpiryError:  '',
    touched: {
      nameAr: false,
      nameEn: false,
      license_number: false,
      file: false,
      start_date: false,
      end_date: false,
      license_expiry: false
    }
  }
}))

// ============================================
// Agreement
// ============================================
const agreed      = ref(props.initialData?.agreed || false)
const agreedError = ref('')
const formSubmitted = ref(false)

// ============================================
// Schema
// ============================================
const buildDocSchema = (isRequired) => {
  return yup.object({
    nameAr: isRequired
      ? yup.string()
          .required(t('errors.isRequired', { name: t('labels.name_ar') }))
          .test('no-english', t('validation.arabic_only'), value => !/[a-zA-Z]/.test(value || ''))
      : yup.string()
          .test('no-english', t('validation.arabic_only'), value => !/[a-zA-Z]/.test(value || '')),

    nameEn: isRequired
      ? yup.string()
          .required(t('errors.isRequired', { name: t('labels.name_en') }))
          .test('no-arabic', t('validation.english_only'), value => !/[ء-ي]/.test(value || ''))
      : yup.string()
          .test('no-arabic', t('validation.english_only'), value => !/[ء-ي]/.test(value || '')),

    license_number: isRequired
      ? yup.string().required(t('errors.isRequired', { name: t('labels.license_number') }))
      : yup.string().nullable(),

    start_date: isRequired
      ? yup.string().required(t('errors.isRequired', { name: t('labels.start_date') }))
      : yup.string().nullable(),

    end_date: isRequired
      ? yup.string()
          .required(t('errors.isRequired', { name: t('labels.end_date') }))
          .test('is-greater', t('validation.date_invalid_range'), function(value) {
            if (!this.parent.start_date || !value) return true
            return new Date(value) >= new Date(this.parent.start_date)
          })
      : yup.string().nullable()
          .test('is-greater', t('validation.date_invalid_range'), function(value) {
            if (!this.parent.start_date || !value) return true
            return new Date(value) >= new Date(this.parent.start_date)
          }),

    license_expiry: isRequired
      ? yup.string()
          .required(t('errors.isRequired', { name: t('labels.license_expiry') }))
          .test('is-greater', t('validation.date_invalid_range'), function(value) {
            if (!this.parent.start_date || !value) return true
            return new Date(value) >= new Date(this.parent.start_date)
          })
      : yup.string().nullable()
          .test('is-greater', t('validation.date_invalid_range'), function(value) {
            if (!this.parent.start_date || !value) return true
            return new Date(value) >= new Date(this.parent.start_date)
          }),

    file: isRequired
      ? yup.array().min(1, t('errors.isRequired', { name: t('labels.file') }))
      : yup.array().nullable(),
  })
}

const agreementSchema = yup.boolean().oneOf([true], t('validation.agree_to_terms_required'))

const validateFormReactive = async () => {
  let allValid = true

  for (let i = 0; i < officialDocsList.value.length; i++) {
    const doc = officialDocsList.value[i]
    const schema = buildDocSchema(i < 5)
    
    try {
      await schema.validate(doc, { abortEarly: false })
      doc.nameArError = ''
      doc.nameEnError = ''
      doc.licenseNumberError = ''
      doc.fileError = ''
      doc.startDateError = ''
      doc.endDateError = ''
      doc.licenseExpiryError = ''
    } catch (err) {
      allValid = false
      if (err.inner) {
        const pathsWithError = err.inner.map(e => e.path)
        
        if (!pathsWithError.includes('nameAr')) doc.nameArError = ''
        if (!pathsWithError.includes('nameEn')) doc.nameEnError = ''
        if (!pathsWithError.includes('license_number')) doc.licenseNumberError = ''
        if (!pathsWithError.includes('file')) doc.fileError = ''
        if (!pathsWithError.includes('start_date')) doc.startDateError = ''
        if (!pathsWithError.includes('end_date')) doc.endDateError = ''
        if (!pathsWithError.includes('license_expiry')) doc.licenseExpiryError = ''

        err.inner.forEach(error => {
          const path = error.path
          const isFilled = doc[path] && (Array.isArray(doc[path]) ? doc[path].length > 0 : doc[path].toString().trim() !== '')
          
          if (formSubmitted.value || isFilled || doc.touched[path]) {
            if (path === 'nameAr') doc.nameArError = error.message
            if (path === 'nameEn') doc.nameEnError = error.message
            if (path === 'license_number') doc.licenseNumberError = error.message
            if (path === 'file') doc.fileError = error.message
            if (path === 'start_date') doc.startDateError = error.message
            if (path === 'end_date') doc.endDateError = error.message
            if (path === 'license_expiry') doc.licenseExpiryError = error.message
          }
        })
      }
    }
  }

  const isAgreedValid = await agreementSchema.isValid(agreed.value)
  if (!isAgreedValid) allValid = false
  
  emit('update:valid', allValid)
}

// Track touches to enable "show errors on interaction" behavior
officialDocsList.value.forEach(doc => {
  ['nameAr', 'nameEn', 'license_number', 'file', 'start_date', 'end_date', 'license_expiry'].forEach(field => {
    watch(() => doc[field], (newVal) => {
      const isNotEmpty = newVal !== '' && newVal !== null && (!Array.isArray(newVal) || newVal.length > 0)
      if (isNotEmpty) {
        doc.touched[field] = true
      }
    })
  })
})

watch(officialDocsList, validateFormReactive, { deep: true })
watch(agreed, validateFormReactive, { immediate: true })

// ============================================
// Expose
// ============================================
defineExpose({
  validate: async () => {
    formSubmitted.value = true
    agreedError.value = ''
    await validateFormReactive()
    
    let valid = true
    officialDocsList.value.forEach((doc) => {
       if (doc.nameArError || doc.nameEnError || doc.licenseNumberError || doc.fileError || doc.startDateError || doc.endDateError || doc.licenseExpiryError) {
         valid = false
       }
    })

    try {
      await agreementSchema.validate(agreed.value)
    } catch (err) {
      agreedError.value = err.message
      toastError(err.message)
      valid = false
    }

    if (!valid && !agreedError.value) {
      toastError(t('errors.pleaseFillAllFields'))
    }

    return valid
  },
  setErrors: (errs) => {
    formSubmitted.value = true
    Object.entries(errs).forEach(([key, msg]) => {
      if (key === 'agreed') {
        agreedError.value = msg
      } else if (key.startsWith('documents.')) {
        const parts = key.split('.')
        const index = parseInt(parts[1])
        const field = parts[parts.length - 1]
        
        if (officialDocsList.value[index]) {
          const doc = officialDocsList.value[index]
          if (field === 'ar' || field === 'nameAr') doc.nameArError = msg
          else if (field === 'en' || field === 'nameEn') doc.nameEnError = msg
          else if (field === 'license_number') doc.licenseNumberError = msg
          else if (field === 'file') doc.fileError = msg
          else if (field === 'start_date') doc.startDateError = msg
          else if (field === 'end_date') doc.endDateError = msg
          else if (field === 'license_expiry') doc.licenseExpiryError = msg
        }
      }
    })
  },

  getValues: () => {
    const validDocs = officialDocsList.value.filter(d => d.file && d.file.length > 0)
    return {
      documents: validDocs.map(d => ({
        document_type:  d.document_type,
        name: {
          ar: d.nameAr || d.labelAr,
          en: d.nameEn || d.labelEn
        },
        license_number: d.license_number || null,
        start_date:     d.start_date     || null,
        end_date:       d.end_date       || null,
        license_expiry: d.license_expiry || null,
        file:           d.file[0]
      })),
      agreed: agreed.value
    }
  }
})
</script>

<style scoped>
.secondary-title {
  font-size: 16px;
  padding: 10px;
  background-color: var(--light-primary-color);
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
}
</style>