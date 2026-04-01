<template>
  <div class="documents-wrapper flex-column gap-md">
    <!-- Loop through all document types -->
    <div v-for="(doc, index) in officialDocsList" :key="doc.document_type" class="grid grid-3 gap-md">
      
      <!-- Section Title -->
      <h5 class="secondary-title full-width">{{ doc.labelAr }} / {{ doc.labelEn }}</h5>
      
      <InputsFormInput v-model="doc.nameAr" :label="t('labels.name_ar')" :placeholder="t('placeholders.name_ar')" />
      <InputsFormInput v-model="doc.nameEn" :label="t('labels.name_en')" :placeholder="t('placeholders.name_en')" />
      <InputsFormInput v-model="doc.license_number" :label="t('labels.license_number')" type="text" :placeholder="t('placeholders.license_number')" />
      
      <InputsDatePicker v-model="doc.start_date" :label="t('labels.start_date')" />
      <InputsDatePicker v-model="doc.end_date" :label="t('labels.end_date')" />
      <InputsDatePicker v-model="doc.license_expiry" :label="t('labels.license_expiry')" />
      
      <div class="full-width">
        <InputsFileUploader accept=".pdf,.xml,.doc,.docx,.png,.jpg,.jpeg" accept-label="PDF , XML , Word , Images" @update:files="doc.file = $event" />
      </div>
    </div>

    <!-- Agreement -->
    <div class="mt-3">
        <InputsApprove id="agree-terms" v-model="agreed" :label="t('labels.agree_to_terms')" :error="agreedError" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppToast } from '#imports'

const { t } = useI18n()
const { error: toastError } = useAppToast()

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

// Define only the types confirmed from the user's collection to avoid validation issues with unknown types
const documentEnums = [
  { type: 'CUSTOM_DECLARATION', ar: 'تصريح جمركي', en: 'Custom Declaration' },
  { type: 'IMPORT_LICENSE', ar: 'رخصة استيراد', en: 'Import License' },
  { type: 'AGENCY_REGISTRATION', ar: 'تسجيل وكالة', en: 'Agency Registration' },
  { type: 'TRADEMARK_LOGO', ar: 'شعار تجاري', en: 'Trademark Logo' },
  { type: 'IMPORTED_FOOD_CERTIFICATE', ar: 'شهادة استيراد أغذية', en: 'Imported Food Certificate' },
  { type: 'UNION_CIRCULAR', ar: 'تعميم الاتحاد', en: 'Union Circular' },
  { type: 'SIGNATURE_APPROVAL', ar: 'اعتماد توقيع', en: 'Signature Approval' },
  { type: 'COMMERCIAL_LICENSE_COPY', ar: 'نسخة رخصة تجارية', en: 'Commercial License Copy' },
  { type: 'CHAMBER_CERTIFICATE', ar: 'شهادة الغرفة', en: 'Chamber Certificate' },
  { type: 'MUNICIPALITY_HEALTH_CERTIFICATE', ar: 'شهادة صحية بلدية', en: 'Municipality Health Certificate' },
  { type: 'INDUSTRIAL_AUTHORITY_CERTIFICATE', ar: 'شهادة الهيئة العامة للصناعة', en: 'Industrial Authority Certificate' },
  { type: 'INDUSTRIAL_FACILITY_CERTIFICATE', ar: 'شهادة منشأة صناعية', en: 'Industrial Facility Certificate' },
]

const officialDocsList = ref(documentEnums.map(doc => {
  const existing = props.initialData?.documents?.find(d => d.document_type === doc.type) || {}
  return {
    document_type: doc.type,
    labelAr: doc.ar,
    labelEn: doc.en,
    nameAr: existing.name?.ar || doc.ar,
    nameEn: existing.name?.en || doc.en,
    license_number: existing.license_number || '',
    start_date: existing.start_date || '',
    end_date: existing.end_date || '',
    license_expiry: existing.license_expiry || '',
    file: existing.file ? [existing.file] : []
  }
}))

const agreed = ref(props.initialData?.agreed || false)
const agreedError = ref('')

const emit = defineEmits(['update:valid'])

watch(agreed, (newVal) => {
  emit('update:valid', newVal)
}, { immediate: true })

defineExpose({
  validate: async () => {
    agreedError.value = ''
    if (!agreed.value) {
      agreedError.value = t('validation.agree_to_terms_required')
      toastError(t('validation.agree_to_terms_required'))
      return false
    }
    return true
  },
  getValues: () => {
    // Only return documents that have a file uploaded
    // Filter strictly to prevent sending empty document slots that trigger Laravel validation errors
    const validDocs = officialDocsList.value.filter(d => d.file && d.file.length > 0)
    
    return {
      documents: validDocs.map(d => ({
        document_type: d.document_type,
        name: {
          ar: d.nameAr || d.labelAr,
          en: d.nameEn || d.labelEn
        },
        license_number: d.license_number || null,
        start_date: d.start_date || null,
        end_date: d.end_date || null,
        license_expiry: d.license_expiry || null,
        file: d.file[0]
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
