<template>
  <div class="settings-wrapper">
    <PageLayout
      :asideTitle="'البيانات الشخصية'"
      :asideItems="profileDataViewMenu"
      :activeIndex="activeTab"
      :hasSearch="false"
      :formTitle="isEditing ? t('common.edit') + ' ' + (profileDataViewMenu[activeTab]?.title || '') : profileDataViewMenu[activeTab]?.title || ''"
      @item-click="handleTabClick"
    >
      <template #header-actions v-if="profileData && !loading" >
         <button v-if="!isEditing" class="edit-link flex-end align-items-start gap-xs secondary" @click="startEditing">
            <IconsEdit width="16" height="16" />
            <span>{{ t('common.edit') }}</span>
         </button>
      </template>

      <template #main>
        <div v-if="loading" class="flex-center" style="min-height: 300px;">
          <span>{{ t('common.loading') }}</span>
        </div>

        <template v-else-if="profileData">

          <div v-if="isEditing" class="flex-column gap-md">
            <!-- Tab 0: تعديل بيانات المنشأة -->
            <div v-if="activeTab === 0" class="grid grid-2 gap-sm">
              <InputsFormInput
                v-model="editedData.name.ar"
                :label="t('suppliers.interprise_name_ar')"
                :placeholder="t('placeholders.company_name_ar')"
                :error="vErrors['name.ar']"
              />
              <InputsFormInput
                v-model="editedData.name.en"
                :label="t('suppliers.interprise_name_en')"
                :placeholder="t('placeholders.company_name_en')"
                :error="vErrors['name.en']"
              />
              <InputsDatePicker
                v-model="editedData.license_start_date"
                :label="t('labels.license_start')"
                :placeholder="t('placeholders.select')"
              />
              <InputsDatePicker
                v-model="editedData.license_end_date"
                :label="t('labels.license_end')"
                :placeholder="t('placeholders.select')"
              />
              <InputsFormInput
                v-model="editedData.license_number"
                :label="t('labels.license_number')"
                :placeholder="t('placeholders.license_number')"
                :error="vErrors.license_number"
              />
              <InputsFormInput
                v-model="editedData.commercial_register"
                :label="t('suppliers.commercial_register')"
                :placeholder="t('suppliers.commercial_register')"
                :error="vErrors.commercial_register"
              />
              <InputsFormInput
                v-model="editedData.deputy_manager_name"
                :label="t('suppliers.deputy_manager_name')"
                :placeholder="t('placeholders.supplier_deputy')"
                :error="vErrors.deputy_manager_name"
              />
              <InputsFormInput
                v-model="editedData.password"
                type="password"
                :label="t('labels.password')"
                :placeholder="t('placeholders.password')"
              />
              <InputsFormSelect
                v-model="editedData.supplier_type_id"
                :label="t('suppliers.supplier_type')"
                :options="supplierTypes"
                :placeholder="t('placeholders.supplier_type')"
                :error="vErrors.supplier_type_id"
              />
              <InputsDatePicker
                v-model="editedData.health_license_expiry"
                :label="t('labels.health_license_end')"
                :placeholder="t('placeholders.select')"
              />
              <InputsDatePicker
                v-model="editedData.industrial_license_expiry"
                :label="t('labels.industrial_license_end')"
                :placeholder="t('placeholders.select')"
              />
              <div class="full-width grid grid-2 gap-sm">
                <InputsFileUploader
                  v-model="editedData.industry_authority_cert"
                  :label="t('labels.industry_authority_cert')"
                />
                <InputsFileUploader
                  v-model="editedData.industrial_facility_cert"
                  :label="t('labels.industrial_facility_cert')"
                />
              </div>
            </div>

            <!-- Tab 1: تعديل بيانات التواصل -->
            <div v-else-if="activeTab === 1" class="grid grid-2 gap-sm">
              <InputsFormInput
                v-model="editedData.mobile"
                :label="t('labels.supplier_mobile')"
                :placeholder="t('placeholders.supplier_mobile')"
                :error="vErrors.mobile"
              />
              <InputsFormInput
                v-model="editedData.phone"
                :label="t('labels.supplier_phone')"
                :placeholder="t('placeholders.supplier_phone')"
                :error="vErrors.phone"
              />
              <InputsFormInput
                v-model="editedData.email"
                :label="t('labels.email')"
                :placeholder="t('placeholders.email')"
                :error="vErrors.email"
              />
              <InputsFormInput
                v-model="editedData.fax"
                :label="t('labels.fax')"
                :placeholder="t('placeholders.fax')"
              />
              <InputsFormInput
                v-model="editedData.address"
                :label="t('labels.detailed_address')"
                :placeholder="t('placeholders.detailed_address')"
                :error="vErrors.address"
              />
              <InputsFormInput
                v-model="editedData.website"
                :label="t('labels.website')"
                :placeholder="t('placeholders.website_url')"
              />
            </div>

            <!-- Tab 2: تعديل المستندات -->
            <div v-else-if="activeTab === 2" class="flex-column gap-sm">
              <div
                v-for="doc in editedData.documents"
                :key="doc.id"
                class="document-card edit-mode"
              >
                <div class="section-label">
                  {{ doc.name?.[locale] || doc.name?.ar || doc.LocalizedName }}
                </div>
                <div class="grid grid-2 gap-sm">
                  <InputsFormInput
                    v-model="doc.name.ar"
                    :label="t('suppliers.supplier_name_ar')"
                  />
                  <InputsFormInput
                    v-model="doc.name.en"
                    :label="t('suppliers.supplier_name_en')"
                  />
                  <InputsDatePicker
                    v-model="doc.start_date"
                    :label="t('labels.start_date')"
                  />
                  <InputsDatePicker
                    v-model="doc.end_date"
                    :label="t('labels.end_date')"
                  />
                  <InputsDatePicker
                    v-model="doc.license_expiry"
                    :label="t('labels.license_expiry')"
                  />
                  <InputsFormInput
                    v-model="doc.license_number"
                    :label="t('labels.license_number')"
                  />
                  <div class="full-width">
                     <InputsFileUploader v-model="doc.file" :label="t('common.documents_data')" />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-start gap-sm mt-md">
              <button class="custom-btn primary-btn min-btn-width" @click="saveChanges" :disabled="saving">
                {{ saving ? t('common.saving') : t('buttons.save_changes') }}
              </button>
              <button class="custom-btn text-btn min-btn-width" @click="cancelEditing">
                {{ t('common.cancel') }}
              </button>
            </div>

          </div>

          <div v-else class="flex-column gap-md">

          <!-- Tab 0: بيانات المنشأة -->
          <div v-if="activeTab === 0" class="grid grid-2 gap-xs">

            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.interprise_name_ar') }}</label>
              <p class="field-value">{{ profileData.name?.ar || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.interprise_name_en') }}</label>
              <p class="field-value">{{ profileData.name?.en || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.supplier_type') }}</label>
              <p class="field-value">{{ profileData.supplierType?.name?.[locale] || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.deputy_manager_name') }}</label>
              <p class="field-value">{{ profileData.deputy_manager_name || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.code') }}</label>
              <p class="field-value">{{ profileData.code || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.commercial_register') }}</label>
              <p class="field-value">{{ profileData.commercial_register || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.license_start_date') }}</label>
              <p class="field-value">{{ profileData.license_start_date || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.license_end_date') }}</label>
              <p class="field-value">{{ profileData.license_end_date || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.industrial_license_expiry') }}</label>
              <p class="field-value">{{ profileData.industrial_license_expiry || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.health_license_expiry') }}</label>
              <p class="field-value">{{ profileData.health_license_expiry || '—' }}</p>
            </div>
          </div>

          <!-- Tab 1: بيانات التواصل -->
          <div v-else-if="activeTab === 1" class="grid grid-2 gap-xs">
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.supplier_phone') }}</label>
              <p class="field-value">{{ profileData.phone || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.supplier_mobile') }}</label>
              <p class="field-value">{{ profileData.mobile || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.license_end_date') }}</label>
              <p class="field-value">{{ profileData.license_end_date || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.fax') }}</label>
              <p class="field-value">{{ profileData.fax || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.email') }}</label>
              <p class="field-value">{{ profileData.email || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.address') }}</label>
              <p class="field-value">{{ profileData.address || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.website') }}</label>
              <a v-if="profileData.website" :href="profileData.website" target="_blank" class="success">
                {{ profileData.website }}
              </a>
              <p v-else class="field-value">—</p>
            </div>
          </div>

          <!-- Tab 2: بيانات المستندات -->
          <div v-else-if="activeTab === 2" class="flex-column gap-sm">

            <div
              v-for="doc in profileData.documents"
              :key="doc.id"
              class="document-card"
            >
           <div class="section-label">
              {{ doc.name?.[locale] || doc.name?.ar || doc.LocalizedName }}
            </div>

              <div class="flex-start">
                <div class="grid grid-2 gap-sm w-100">
                <div class="flex-between gap-xs view-field">
                  <label class="field-label">{{ t('suppliers.supplier_name_ar') }}</label>
                  <p class="field-value">{{ doc.name?.ar || '—' }}</p>
                </div>
                <div class="flex-between gap-xs view-field">
                  <label class="field-label">{{ t('suppliers.supplier_name_en') }}</label>
                  <p class="field-value">{{ doc.name?.en || '—' }}</p>
                </div>
                <div class="flex-between gap-xs view-field">
                  <label class="field-label">{{ t('labels.start_date') }}</label>
                  <p class="field-value">{{ doc.start_date || '—' }}</p>
                </div>
                <div class="flex-between gap-xs view-field">
                  <label class="field-label">{{ t('labels.end_date') }}</label>
                  <p class="field-value">{{ doc.end_date || '—' }}</p>
                </div>
                <div class="flex-between gap-xs view-field">
                  <label class="field-label">{{ t('labels.license_expiry') }}</label>
                  <p class="field-value">{{ doc.license_expiry || '—' }}</p>
                </div>
                <div class="flex-between gap-xs view-field">
                  <label class="field-label">{{ t('labels.license_number') }}</label>
                  <p class="field-value">{{ doc.license_number || '—' }}</p>
                </div>
              </div>

            <div class="document-preview flex-center">
              <a :href="doc.file?.fullPath"
                target="_blank"
                :download="doc.file?.name"
                class="doc-file-link"
              >
                <IconsPdf v-if="doc.file?.ext === 'pdf' || doc.file?.type === 'pdf'" />
                <IconsFile v-else />
              </a>
            </div>

              </div>
            </div>

          </div>

          </div>

        </template>

      </template>
    </PageLayout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as yup from 'yup'
import { useAppToast } from "~/composables/useAppToast"

definePageMeta({ middleware: 'auth' })
usePageMeta('menu.profile')

const { t, locale } = useI18n()
const api = useApi()
const route = useRoute()
const { success: toastSuccess, error: toastError } = useAppToast()

const profileData = ref(null)
const loading = ref(false)
const saving = ref(false)
const activeTab = ref(0)
const isEditing = ref(false)
const editedData = ref({})
const vErrors = ref({})
const supplierTypes = ref([])

const schema = computed(() => yup.object({
  name: yup.object({
    ar: yup.string().required(t('errors.isRequired', { name: t('suppliers.interprise_name_ar') })),
    en: yup.string().required(t('errors.isRequired', { name: t('suppliers.interprise_name_en') })),
  }),
  supplier_type_id: yup.mixed().required(t('errors.isRequired', { name: t('suppliers.supplier_type') })),
  commercial_register: yup.string().required(t('errors.isRequired', { name: t('suppliers.commercial_register') })),
  email: yup.string().email(t('validation.email_invalid')).required(t('validation.email_required')),
  phone: yup.string().required(t('errors.isRequired', { name: t('labels.supplier_phone') })),
  mobile: yup.string().required(t('errors.isRequired', { name: t('labels.supplier_mobile') })),
  address: yup.string().required(t('errors.isRequired', { name: t('labels.address') })),
  deputy_manager_name: yup.string().required(t('errors.isRequired', { name: t('suppliers.deputy_manager_name') })),
  license_number: yup.string().required(t('errors.isRequired', { name: t('labels.license_number') })),
}))

const profileDataViewMenu = computed(() => [
  { title: t('common.company_data'),  icon: resolveComponent('IconsBuilding') },
  { title: t('common.contact_data'),   icon: resolveComponent('IconsResponsibleData') },
  { title: t('common.documents_data'), icon: resolveComponent('IconsLogs') },
])

const handleTabClick = (index) => {
  activeTab.value = index
  isEditing.value = false
}

const startEditing = () => {
  const data = JSON.parse(JSON.stringify(profileData.value))
  
  // Ensure supplier_type_id is set from the nested object if missing at root
  if (!data.supplier_type_id && data.supplierType?.id) {
    data.supplier_type_id = data.supplierType.id
  }
  
  editedData.value = data
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editedData.value = {}
  vErrors.value = {}
}

const saveChanges = async () => {
  try {
    vErrors.value = {}
    await schema.value.validate(editedData.value, { abortEarly: false })
    
    saving.value = true
    const formData = new FormData()

    // 1. Basic Fields
    formData.append('supplier_type_id', editedData.value.supplier_type_id || '')
    formData.append('name[ar]', editedData.value.name?.ar || '')
    formData.append('name[en]', editedData.value.name?.en || '')
    formData.append('commercial_register', editedData.value.commercial_register || '')
    formData.append('license_start_date', editedData.value.license_start_date || '')
    formData.append('license_end_date', editedData.value.license_end_date || '')
    formData.append('health_license_expiry', editedData.value.health_license_expiry || '')
    formData.append('industrial_license_expiry', editedData.value.industrial_license_expiry || '')
    formData.append('deputy_manager_name', editedData.value.deputy_manager_name || '')
    formData.append('password', editedData.value.password || '')
    formData.append('phone', editedData.value.phone || '')
    formData.append('mobile', editedData.value.mobile || '')
    formData.append('email', editedData.value.email || '')
    formData.append('address', editedData.value.address || '')
    formData.append('website', editedData.value.website || '')

    // 2. Specific Certificates (Files)
    if (editedData.value.industry_authority_cert?.length) {
      formData.append('industry_authority_cert', editedData.value.industry_authority_cert[0])
    }
    if (editedData.value.industrial_facility_cert?.length) {
      formData.append('industrial_facility_cert', editedData.value.industrial_facility_cert[0])
    }

    // 3. Documents Array
    if (editedData.value.documents && editedData.value.documents.length) {
      editedData.value.documents.forEach((doc, index) => {
        formData.append(`documents[${index}][id]`, doc.id || '')
        formData.append(`documents[${index}][name][ar]`, doc.name?.ar || '')
        formData.append(`documents[${index}][name][en]`, doc.name?.en || '')
        formData.append(`documents[${index}][start_date]`, doc.start_date || '')
        formData.append(`documents[${index}][end_date]`, doc.end_date || '')
        formData.append(`documents[${index}][license_expiry]`, doc.license_expiry || '')
        formData.append(`documents[${index}][license_number]`, doc.license_number || '')
        if (doc.file && doc.file.length) {
            formData.append(`documents[${index}][file]`, doc.file[0])
        }
      })
    }

    const res = await api(`/profile`, {
      method: 'POST',
      body: formData
    })

    if (res.success) {
       profileData.value = res.data
       const userCookie = useCookie('user')
       userCookie.value = res.data
       isEditing.value = false
       toastSuccess(t('messages.updated_successfully', { item: t('menu.supplier_profile') }))
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
       err.inner.forEach(error => {
          vErrors.value[error.path] = error.message
       })
       toastError(t('errors.pleaseFillAllFields'))
       return
    }

    let errorMessage = err.data?.message || t('common.somethingWentWrong')
    
    // Explicitly check for validation errors from the backend
    if (err.data?.errors) {
       const allErrors = Object.values(err.data.errors).flat()
       const uniqueErrors = [...new Set(allErrors)]
       
       if (uniqueErrors.length) {
         // Show only the first three unique errors
         const limitedErrors = uniqueErrors.slice(0, 3)
         errorMessage = limitedErrors.join('\n')
         if (uniqueErrors.length > 3) {
            errorMessage += '\n...'
         }
       }
    }

    toastError(errorMessage)
    
    if (err.data && err.data.errors) {
       console.error("Validation Errors Detail:", err.data.errors)
    }
    console.error("Update request failed:", err)
  } finally {
    saving.value = false
  }
}

const fetchProfile = async () => {
  try {
    loading.value = true
    const res = await api(`/profile`)
    profileData.value = res.data
    console.log("profile data : ",profileData.value);
    
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchSupplierTypes = async () => {
  try {
    const res = await api('/supplier-types')
    supplierTypes.value = res.data.map(type => ({
      label: type.LocalizedName || type.name,
      value: type.id
    }))
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchProfile()
  fetchSupplierTypes()
})
</script>

<style scoped>
.edit-link {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}
.toast-detail {
  font-weight: 500;
  font-size: 14px !important;
  color: inherit;
  white-space: pre-wrap !important;
}
.edit-link:hover {
  opacity: 0.8;
}
.document-card {
  padding: 15px;
  border: 1px solid #F4F5F6;
  border-radius: var(--radius-md);
  background: #fff;
}
.document-card.edit-mode {
  background: #fdfdfd;
}
.document-preview {
  min-width: 100px;
  min-height: 100px;
}
.document-preview svg {
  min-width: 70px;
  min-height: 70px;
}
.doc-file-link:hover {
  opacity: 0.7;
}
.mt-md {
  margin-top: 20px;
}
</style>
