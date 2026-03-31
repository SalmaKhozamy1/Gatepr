<template>
  <div class="settings-wrapper">
    <PageLayout
      :asideItems="supplierViewMenu"
      :activeIndex="activeTab"
      :hasSearch="false"
      :formTitle="supplierViewMenu[activeTab]?.title || ''"
      @item-click="handleTabClick"
    >
      <template #main>
        <div v-if="loading" class="flex-center" style="min-height: 300px;">
          <span>{{ t('common.loading') }}</span>
        </div>

        <template v-else-if="supplier">

          <!-- Tab 0: بيانات المنشأة -->
          <div v-if="activeTab === 0" class="grid grid-2 gap-xs">

            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.interprise_name_ar') }}</label>
              <p class="field-value">{{ supplier.name?.ar || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.interprise_name_en') }}</label>
              <p class="field-value">{{ supplier.name?.en || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.supplier_type') }}</label>
              <p class="field-value">{{ supplier.supplierType?.LocalizedName || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.code') }}</label>
              <p class="field-value">{{ supplier.code || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.commercial_register') }}</label>
              <p class="field-value">{{ supplier.commercial_register || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.deputy_manager_name') }}</label>
              <p class="field-value">{{ supplier.deputy_manager_name || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.license_start_date') }}</label>
              <p class="field-value">{{ supplier.license_start_date || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.license_end_date') }}</label>
              <p class="field-value">{{ supplier.license_end_date || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.health_license_expiry') }}</label>
              <p class="field-value">{{ supplier.health_license_expiry || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.industrial_license_expiry') }}</label>
              <p class="field-value">{{ supplier.industrial_license_expiry || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('common.status') }}</label>
              <p class="field-value">{{ supplier.status || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('suppliers.register_request_date') }}</label>
              <p class="field-value">{{ supplier.register_request_date || '—' }}</p>
            </div>
          </div>

          <!-- Tab 1: بيانات التواصل -->
          <div v-else-if="activeTab === 1" class="grid grid-2 gap-xs">
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.supplier_phone') }}</label>
              <p class="field-value">{{ supplier.phone || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.supplier_mobile') }}</label>
              <p class="field-value">{{ supplier.mobile || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.license_end_date') }}</label>
              <p class="field-value">{{ supplier.license_end_date || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.fax') }}</label>
              <p class="field-value">{{ supplier.fax || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.email') }}</label>
              <p class="field-value">{{ supplier.email || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.address') }}</label>
              <p class="field-value">{{ supplier.address || '—' }}</p>
            </div>
            <div class="flex-between gap-xs view-field">
              <label class="field-label">{{ t('labels.website') }}</label>
              <a v-if="supplier.website" :href="supplier.website" target="_blank" class="success">
                {{ supplier.website }}
              </a>
              <p v-else class="field-value">—</p>
            </div>

          </div>

          <!-- Tab 2: بيانات المستندات -->
          <div v-else-if="activeTab === 2" class="flex-column gap-sm">

            <div
              v-for="doc in supplier.documents"
              :key="doc.id"
              class="document-card"
            >
           <div class="section-label">
              {{ doc.name?.[locale] || doc.name?.ar || doc.LocalizedName }}
            </div>

              <div class="flex-start">
                <div class="grid grid-2 gap-xs w-100">
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

        </template>

      </template>
    </PageLayout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({ middleware: 'auth' })

const { t, locale } = useI18n()
const api = useApi()
const route = useRoute()

const supplier = ref(null)
const loading = ref(false)
const activeTab = ref(0)

const supplierViewMenu = computed(() => [
  { title: t('common.company_data'),  icon: resolveComponent('IconsBuilding') },
  { title: t('common.contact_data'),   icon: resolveComponent('IconsResponsibleData') },
  { title: t('common.documents_data'), icon: resolveComponent('IconsLogs') },
])

const handleTabClick = (index) => {
  activeTab.value = index
}

const fetchSupplier = async () => {
  try {
    loading.value = true
    const res = await api(`/v1/admin/suppliers/${route.params.id}`)
    supplier.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchSupplier())
</script>

<style scoped>
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
</style>
