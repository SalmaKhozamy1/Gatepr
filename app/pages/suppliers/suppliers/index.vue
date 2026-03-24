<template>
  <div>
    <Teleport to="#search-teleport-target">
      <SearchBar
        :placeholder="t('common.search')"
        :filters="searchFilters"
        :loading="loading"
        @filter="handleFilter"
        @reset="resetFilters"
      />
    </Teleport>

    <TablesAppTable
      :headers="headers"
      :current-page="currentPage"
      :total-pages="totalPages"
      :per-page="perPage"
      :loading="loading"
      @update:current-page="handlePageChange"
    >
      <template #body="{ getIndex }">
        <tr v-if="!loading && suppliers.length === 0">
          <td :colspan="headers.length" class="text-center py-5 no-data">
            {{ t('common.no_results_found') }}
          </td>
        </tr>

        <tr v-for="(supplier, index) in suppliers" :key="supplier.id">
          <th class="index-cell">{{ getIndex(index) }}</th>
          <td>{{ supplier.name?.[locale] || supplier.name?.ar || supplier.LocalizedName }}</td>
          <td>{{ supplier.supplierType?.LocalizedName || '—' }}</td>
          <td class="nowrap">{{ supplier.phone || '—' }}</td>
          <td>{{ supplier.email || '—' }}</td>
          <td>
            <div class="toggle-switch-input">
              <InputsToggleSwitch
                :modelValue="supplier.active === 'yes'"
                :disabled="togglingId === supplier.id"
                @update:modelValue="handleToggleActive(supplier)"
              />
            </div>
          </td>
          <td class="actions-cell">
            <div>
              <button
                class="action-btn view"
                :title="t('common.view')"
                @click="handleView(supplier.id)"
              >
                <IconsEye width="18" height="18" />
              </button>
                <button
                  class="action-btn download"
                  :title="t('common.download')"
                  @click="handleDownload(supplier.id)"
                  :disabled="downloadLoading === supplier.id"
                >
                  <IconsDownload width="18" height="18" v-if="downloadLoading !== supplier.id" />
                  <span class="spinner-border spinner-border-sm" v-else></span>
                </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
usePageMeta('menu.suppliers')

import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'
import { useView } from '~/composables/useView'

const { t, locale } = useI18n()
const api = useApi()
const { viewItem } = useView()
const { success: toastSuccess, error: toastError } = useAppToast()

/* =============================
   STATE
============================== */
const suppliers = ref([])
const supplierTypeOptions = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)
const togglingId = ref(null)
const downloadLoading = ref(null)

const filters = ref({
  search: '',
  status: null,
  supplier_type_id: null
})

/* =============================
   COMPUTED
============================== */
const headers = computed(() => [
  { label: '#', class: 'index-cell' },
  { label: t('suppliers.supplier_name'), class: '' },
  { label: t('suppliers.supplier_type'), class: '' },
  { label: t('labels.phone'), class: '' },
  { label: t('labels.email'), class: '' },
  { label: t('common.status'), class: '' },
  { label: t('common.actions'), class: 'actions-cell' }
])

const statusOptions = computed(() => [
  { label: t('suppliers.status.pending'),  value: 'pending' },
  { label: t('suppliers.status.approved'), value: 'approved' },
  { label: t('suppliers.status.rejected'), value: 'rejected' }
])

const searchFilters = computed(() => [
  {
    key: 'status',
    placeholder: t('suppliers.status_filter'),
    options: statusOptions.value
  },
  {
    key: 'supplier_type_id',
    placeholder: t('suppliers.supplier_type'),
    options: supplierTypeOptions.value
  }
])

/* =============================
   HELPERS
============================== */
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

const parseMeta = (meta = {}) => {
  const getValue = (val) => {
    if (Array.isArray(val)) return val[0] ?? 1
    return val ?? 1
  }
  return {
    lastPage: getValue(meta.last_page),
    currentPage: getValue(meta.current_page) || 1
  }
}

/* =============================
   FETCHERS
============================== */
const fetchSuppliers = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: '-created_at',
      with: 'supplierType'
    })

    if (filters.value.search)           params.append('search', filters.value.search)
    if (filters.value.status)           params.append('status', filters.value.status)
    if (filters.value.supplier_type_id) params.append('supplier_type_id', filters.value.supplier_type_id)

    const res = await api(`/v1/admin/suppliers?${params}`)
    suppliers.value = res.data || []
    
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    currentPage.value = meta.currentPage
  } catch (err) {
    console.error('Error fetching suppliers:', err)
    suppliers.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const fetchSupplierTypes = async () => {
  try {
    const res = await api('/v1/admin/supplier-types?per_page=100')
    supplierTypeOptions.value = (res.data || []).map(item => ({
      label: item.name?.[locale.value] || item.name?.ar || item.LocalizedName,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching supplier types:', err)
  }
}

/* =============================
   ACTIONS
============================== */
const handleFilter = (form) => {
  filters.value = {
    search: form.search || '',
    status: form.status || null,
    supplier_type_id: form.supplier_type_id || null
  }
  currentPage.value = 1
  fetchSuppliers()
}

const resetFilters = () => {
  filters.value = {
    search: '',
    status: null,
    supplier_type_id: null
  }
  currentPage.value = 1
  fetchSuppliers()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchSuppliers()
}

const handleView = async (id) => {
  console.log('Viewing supplier:', id)
}

const handleDownload = async (id) => {
  try {
    downloadLoading.value = id
    // Logic for downloading supplier files or summary
    console.log('Downloading supplier:', id)
    // const res = await api(`/v1/admin/suppliers/${id}/export`)
    // if (res.file_url) window.open(res.file_url, '_blank')
  } catch (err) {
    console.error('Download error:', err)
  } finally {
    downloadLoading.value = null
  }
}

const handleToggleActive = async (supplier) => {
  const originalState = supplier.active
  const newActiveState = originalState === 'yes' ? 'no' : 'yes'
  
  try {
    togglingId.value = supplier.id
    
    // Optimistic UI update
    supplier.active = newActiveState
    
    await api('/v1/admin/toggle-supplier-active', {
      method: 'POST',
      body: {
        supplier_id: supplier.id,
        active: newActiveState
      }
    })
    
    toastSuccess(t('messages.updated_successfully'))
  } catch (err) {
    console.error('Error toggling supplier active status:', err)
    // Rollback on error
    supplier.active = originalState
    toastError(err.message || t('common.somethingWentWrong'))
  } finally {
    togglingId.value = null
  }
}

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchSuppliers())

onMounted(() => {
  fetchSuppliers()
  fetchSupplierTypes()
})
</script>
