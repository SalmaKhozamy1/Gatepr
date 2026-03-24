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
        <tr v-if="!loading && requests.length === 0">
          <td :colspan="headers.length" class="text-center py-5 no-data">
            {{ t('common.no_results_found') }}
          </td>
        </tr>

        <tr v-for="(request, index) in requests" :key="request.id">
          <th class="index-cell">{{ getIndex(index) }}</th>
          <td>{{ request.supplier?.name?.[locale] || request.supplier?.name?.ar || request.supplier?.LocalizedName }}</td>
          <td>{{ request.supplier?.supplierType?.LocalizedName || '—' }}</td>
          <td class="nowrap">{{ request.supplier?.phone || '—' }}</td>
          <td>{{ request.supplier?.email || '—' }}</td>
          <td class="nowrap">{{ formatDate(request.created_at) }}</td>
          <td class="actions-cell">
            <button class="action-btn view" :title="t('common.view')" @click="handleView(request)">
              <IconsEye width="18" height="18" />
            </button>
          </td>
          <td class="actions-cell">
            <div>
              <button
                class="action-btn accept"
                :title="t('buttons.accept')"
                @click="handleAccept(request)"
                :disabled="acceptingId === request.id"
              >
                <IconsCheck width="18" height="18" />
              </button>
              <button
                class="action-btn reject"
                :title="t('buttons.reject')"
                @click="handleReject(request)"
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
    :supplierId="selectedRequest?.supplier?.id"
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
const dateFilter = ref('')
const supplierTypeOptions = ref([])
const requests = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)
const acceptingId = ref(null)

const showRejectModal = ref(false)
const selectedRequest = ref(null)

const headers = computed(() => [
  { label: '#', class: 'index-cell' },
  { label: t('suppliers.supplier_name'), class: '' },
  { label: t('suppliers.supplier_type'), class: '' },
  { label: t('labels.phone'), class: '' },
  { label: t('labels.email'), class: '' },
  { label: t('suppliers.registration_request_date'), class: '' }, // Reusing key for request date
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
  { key: 'date', label: t('suppliers.registration_request_date') },
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
   FETCH REQUESTS
============================== */
const fetchRequests = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort_by: 'created_at',
      sort_direction: 'desc',
    })
    
    if (searchQuery.value.trim())         params.append('search', searchQuery.value.trim())
    if (supplierTypeFilter.value)       params.append('supplier_type_id', supplierTypeFilter.value)
    if (dateFilter.value)                params.append('date', dateFilter.value)

    const res = await api(`/v1/admin/profile-update-requests?${params}`)
    requests.value = res.data || []
    
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    currentPage.value = meta.currentPage
  } catch (err) {
    console.error('Error fetching requests:', err)
    requests.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

/* =============================
   ACTIONS
============================== */
const handleView = (request) => {
  console.log('viewing update request:', request)
}

const handleAccept = async (request) => {
  try {
    acceptingId.value = request.id
    // Note: status change for updates might use a different endpoint or the same one
    // Assuming same one for now or placeholders if not documented
    const res = await api('/v1/admin/change-supplier-status', {
      method: 'POST',
      body: {
        supplier_id: request.supplier?.id || request.id,
        status: 'approved',
        request_id: request.id // Often needed for specific requests
      }
    })
    toastSuccess(res.message || t('messages.updated_successfully'))
    requests.value = requests.value.filter(r => r.id !== request.id)
  } catch (err) {
    console.error('Error accepting request:', err)
    toastError(err.message || t('common.somethingWentWrong'))
  } finally {
    acceptingId.value = null
  }
}

const handleReject = (request) => {
  selectedRequest.value = request
  showRejectModal.value = true
}

const handleRejectConfirm = async ({ reason, setLoading, close }) => {
  try {
    setLoading(true)
    const res = await api('/v1/admin/change-supplier-status', {
      method: 'POST',
      body: {
        supplier_id: selectedRequest.value.supplier?.id || selectedRequest.value.id,
        status: 'rejected',
        reason: reason,
        request_id: selectedRequest.value.id
      }
    })
    toastWarn(res.message || t('messages.updated_successfully'))
    requests.value = requests.value.filter(r => r.id !== selectedRequest.value.id)
    close()
  } catch (err) {
    console.error('Error rejecting request:', err)
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
const handleFilter = ({ search, supplier_type_id, date } = {}) => {
  searchQuery.value = search ?? ''
  supplierTypeFilter.value = supplier_type_id || null
  dateFilter.value = date || ''
  currentPage.value = 1
  fetchRequests()
}

const resetFilters = () => {
  searchQuery.value = ''
  supplierTypeFilter.value = null
  dateFilter.value = ''
  currentPage.value = 1
  fetchRequests()
}

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchRequests())

onMounted(() => {
  fetchRequests()
  fetchSupplierTypes()
})
</script>

<style scoped>
.actions-cell > div {
  display: flex;
  gap: var(--gap-xs);
}
</style>