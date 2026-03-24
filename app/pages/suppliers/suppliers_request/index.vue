<template>
  <div>
    <Teleport to="#search-teleport-target">
      <SearchBar
        :placeholder="t('common.search')"
        :filters="searchFilters"
        :dateFilters="dateFilters"
        @filter="handleFilter"
        @reset="resetFilters"
      />
    </Teleport>

    <TablesAppTable
      :headers="headers"
      :current-page="currentPage"
      :total-pages="totalPages"
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
          <td class="nowrap">{{ formatDate(supplier.created_at) }}</td>
          <td class="actions-cell">
            <button class="action-btn view" :title="t('common.view')" @click="handleView(supplier)">
              <IconsEye width="18" height="18" />
            </button>
          </td>
          <td class="actions-cell">
            <div>
              <button
                class="action-btn accept"
                :title="t('buttons.accept')"
                @click="handleAccept(supplier)"
                :disabled="acceptingId === supplier.id"
              >
                <IconsCheck width="18" height="18" />
              </button>
              <button
                class="action-btn reject"
                :title="t('buttons.reject')"
                @click="handleReject(supplier)"
              >
                <IconsCross width="18" height="18" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>
  </div>

  <!-- Reject Modal -->
  <ModalsAppRejectModal
    v-model="showRejectModal"
    :supplierId="selectedSupplier?.id"
    @confirm="handleRejectConfirm"
  />
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
usePageMeta('menu.suppliers')

import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const api = useApi()
const { success: toastSuccess, error: toastError, warn: toastWarn } = useAppToast()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const supplierTypeFilter = ref(null)
const createdDateFilter = ref('')
const supplierTypeOptions = ref([])
const suppliers = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)
const acceptingId = ref(null)

const showRejectModal = ref(false)
const selectedSupplier = ref(null)

const headers = computed(() => [
  { label: '#', class: 'index-cell' },
  { label: t('suppliers.supplier_name'), class: '' },
  { label: t('suppliers.supplier_type'), class: '' },
  { label: t('labels.phone'), class: '' },
  { label: t('labels.email'), class: '' },
  { label: t('suppliers.registration_request_date'), class: '' },
  { label: t('common.actions'), class: 'actions-cell' },
  { label: t('items.accept_reject'), class: 'actions-cell' }
])

/* =============================
   FILTERS
============================== */
const searchFilters = computed(() => [
  {
    key: 'supplier_type_id',
    placeholder: t('suppliers.supplier_type'),
    options: supplierTypeOptions.value
  }
])

const dateFilters = [
  { key: 'created_date', label: t('suppliers.registration_request_date') },
]

/* =============================
   HELPERS
============================== */
const parseMeta = (meta = {}) => {
  const getValue = (val) => {
    if (Array.isArray(val)) return val[0] ?? 1
    return val ?? 1
  }
  return {
    lastPage: getValue(meta.last_page),
    currentPage: getValue(meta.current_page),
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

/* =============================
   FETCH SUPPLIER TYPES
============================== */
const fetchSupplierTypes = async () => {
  try {
    const res = await api('/v1/admin/supplier-types?per_page=100')
    supplierTypeOptions.value = (res.data || []).map(item => ({
      label: item.name?.[locale.value] || item.name?.ar || item.LocalizedName,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching supplier types:', err)
    supplierTypeOptions.value = []
  }
}

/* =============================
   FETCH SUPPLIERS
============================== */
const fetchSuppliers = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      status: 'pending',
      page: currentPage.value,
      per_page: perPage,
      sort: '-created_at',
      with: 'supplierType'
    })
    
    if (searchQuery.value.trim())         params.append('search', searchQuery.value.trim())
    if (supplierTypeFilter.value)       params.append('supplier_type_id', supplierTypeFilter.value)
    if (createdDateFilter.value)        params.append('created_date', createdDateFilter.value)

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

/* =============================
   ACTIONS
============================== */
const handleView = (supplier) => {
  console.log('view:', supplier)
}

const handleAccept = async (supplier) => {
  try {
    acceptingId.value = supplier.id
    const res = await api('/v1/admin/change-supplier-status', {
      method: 'POST',
      body: {
        supplier_id: supplier.id,
        status: 'approved'
      }
    })
    toastSuccess(res.message || t('messages.updated_successfully'))
    fetchSuppliers()
  } catch (err) {
    console.error('Error accepting supplier:', err)
    toastError(err.message || t('common.somethingWentWrong'))
  } finally {
    acceptingId.value = null
  }
}

const handleReject = (supplier) => {
  selectedSupplier.value = supplier
  showRejectModal.value = true
}

const handleRejectConfirm = async ({ reason, setLoading, close }) => {
  try {
    setLoading(true)
    await api('/v1/admin/change-supplier-status', {
      method: 'POST',
      body: {
        supplier_id: selectedSupplier.value.id,
        status: 'rejected',
        reason: reason
      }
    })
    toastWarn(t('messages.updated_successfully'))
    close()
    fetchSuppliers()
  } catch (err) {
    console.error('Error rejecting supplier:', err)
    toastError(err.message || t('common.somethingWentWrong'))
  } finally {
    setLoading(false)
  }
}

/* =============================
   PAGINATION
============================== */
const handlePageChange = (page) => {
  currentPage.value = page
}

/* =============================
   SEARCH & FILTER
============================== */
const handleFilter = ({ search, supplier_type_id, created_date } = {}) => {
  searchQuery.value = search ?? ''
  supplierTypeFilter.value = supplier_type_id || null
  createdDateFilter.value = created_date || ''
  currentPage.value = 1
  fetchSuppliers()
}

const resetFilters = () => {
  searchQuery.value = ''
  supplierTypeFilter.value = null
  createdDateFilter.value = ''
  currentPage.value = 1
  fetchSuppliers()
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

<style scoped>
.actions-cell > div {
  display: flex;
  gap: 3px;
}
</style>