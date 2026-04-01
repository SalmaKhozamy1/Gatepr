<template>
  <div class="register-page">
    <PageLayout
    :formTitle="t('common.add') + ' ' + activeStepTitle"
    :asideItems="steps"
    :activeIndex="activeIndex"
    :hasSearch="false"
    @item-click="changeStep">
      
      <template #main>
        <!-- Main Content -->
        <div class="step-content">

         <!-- Dynamic Step Rendering -->
          <component 
            :is="stepsMenuItems[activeIndex].component" 
            ref="stepComponent" 
            :initial-data="formData[stepsMenuItems[activeIndex].stepKey]"
            @update:valid="currentStepValid = $event"
          />
 
          <div class="flex-end mt-4 gap-sm">
              <button class="custom-btn text-btn min-btn-width" @click="prevStep" v-if="activeIndex > 0">{{ t('buttons.previous') }}</button>
              <button class="custom-btn text-btn min-btn-width" v-else @click="navigateTo('/')">{{ t('common.cancel') }}</button>
              
              <button class="custom-btn secondary-btn min-btn-width" @click="nextStep" v-if="activeIndex < steps.length - 1" :disabled="!currentStepValid">{{ t('buttons.next') }}</button>
              <button class="custom-btn secondary-btn min-btn-width" @click="submit" v-else :disabled="!currentStepValid">{{ t('buttons.send') }}</button>
          </div>
        </div>
      </template>
    </PageLayout>
  </div>
</template>

<script setup>
import { IconsCompanyInformation, IconsOfficialDocuments, IconsResponsibleData } from '#components';
import { AuthRegisterCompanyData, AuthRegisterResponsibleData, AuthRegisterOfficialDocuments } from '#components';
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const api = useApi()
const { success, error: toastError } = useAppToast()

const activeIndex = ref(0)
const stepComponent = ref(null)
const currentStepValid = ref(false)
const maxVisitedStep = ref(0)

const formData = ref({
  company: null,
  responsible: null,
  documents: null
})

const stepsMenuItems = [
    { title: 'company_data', stepKey: 'company', icon: IconsCompanyInformation, component: AuthRegisterCompanyData },
    { title: 'responsible_data', stepKey: 'responsible', icon: IconsResponsibleData, component: AuthRegisterResponsibleData },
    { title: 'official_documents', stepKey: 'documents', icon: IconsOfficialDocuments, component: AuthRegisterOfficialDocuments },
];

const steps = computed(() => stepsMenuItems.map((step, index) => ({
  ...step,
  title: t('auth.' + step.title),
  disabled: index > maxVisitedStep.value
})))

const activeStepTitle = computed(() => steps.value[activeIndex.value]?.title || '')

const saveCurrentStepData = () => {
    if (stepComponent.value && typeof stepComponent.value.getValues === 'function') {
        const currentStepKey = stepsMenuItems[activeIndex.value].stepKey
        formData.value[currentStepKey] = stepComponent.value.getValues()
    }
}

const changeStep = (index) => {
  // Save current state before switching
  saveCurrentStepData()
  activeIndex.value = index
}

const nextStep = async () => {
    if (stepComponent.value && typeof stepComponent.value.validate === 'function') {
        const isValid = await stepComponent.value.validate()
        if (!isValid) return
        
        saveCurrentStepData()
    }
    if (activeIndex.value < steps.value.length - 1) {
        activeIndex.value++
        if (activeIndex.value > maxVisitedStep.value) {
            maxVisitedStep.value = activeIndex.value
        }
    }
}

const prevStep = () => {
    saveCurrentStepData()
    if (activeIndex.value > 0) {
        activeIndex.value--
    }
}

const submit = async () => {
    if (stepComponent.value && typeof stepComponent.value.validate === 'function') {
        const isValid = await stepComponent.value.validate()
        if (!isValid) return
        
        saveCurrentStepData()
    }
    
    try {
        const company = formData.value.company || {}
        const responsible = formData.value.responsible || {}
        const docsObj = formData.value.documents || {}
        const documentsList = docsObj.documents || []

        // Final payload structure
        const payload = {
            // Step 1: Company
            'name[ar]': company.nameAr,
            'name[en]': company.nameEn,
            'commercial_register': company.commercial_register,
            'license_start_date': company.license_start_date,
            'license_end_date': company.license_end_date,
            'health_license_expiry': company.health_license_expiry,
            'industrial_license_expiry': company.industrial_license_expiry,
            'deputy_manager_name': company.deputy_manager_name,
            'password': company.password,
            'supplier_type_id': company.supplier_type_id || 1,
            'general_industry_certificate': company.general_industry_certificate,
            'industrial_establishment_certificate': company.industrial_establishment_certificate,

            // Step 2: Responsible Contact
            'phone': responsible.phone,
            'mobile': responsible.mobile,
            'fax': responsible.fax,
            'email': responsible.email,
            'address': responsible.address,
            'website': responsible.website,

            // Step 3: Documents Array
            'documents': documentsList.map(doc => ({
                document_type: doc.document_type,
                name: {
                    ar: doc.name?.ar,
                    en: doc.name?.en
                },
                license_number: doc.license_number,
                start_date: doc.start_date,
                end_date: doc.end_date,
                license_expiry: doc.license_expiry,
                file: doc.file // This MUST be a file object or blob
            }))
        }

        const fd = new FormData();
        
        const buildFormData = (formData, data, parentKey = '') => {
            if (data instanceof File || data instanceof Blob) {
                formData.append(parentKey, data);
            } else if (Array.isArray(data)) {
                data.forEach((item, index) => {
                    buildFormData(formData, item, `${parentKey}[${index}]`);
                });
            } else if (data !== null && typeof data === 'object' && !(data instanceof Date)) {
                Object.keys(data).forEach(key => {
                    const fullKey = parentKey ? `${parentKey}[${key}]` : key;
                    buildFormData(formData, data[key], fullKey);
                });
            } else if (data !== undefined && data !== null) {
                formData.append(parentKey, data);
            }
        };

        buildFormData(fd, payload);

        await api('/v1/supplier/suppliers', {
            method: 'POST',
            body: fd
        })
        
        success(t('messages.success'))
        navigateTo('/login/supplier')
    } catch(err) {
        console.error('Registration error:', err)
        toastError(err.data?.message || t('common.somethingWentWrong'))
    }
}
</script>

<style scoped>
.secondary-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
@media screen and (max-width: 768px) {
    .step-content :deep(.grid-3),
    .step-content :deep(.grid-2) {
        -ms-grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
        grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
    }
}
</style>
