<template>
  <div>
    <Teleport to="#search-teleport-target">
      <SearchBar
        placeholder="بحث عن مورد .."
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
      <template #body>
        <tr v-if="!loading && requests.length === 0">
          <td :colspan="headers.length" class="text-center danger">
            لا توجد طلبات تعديل للعرض
          </td>
        </tr>

        <tr v-for="request in requests" :key="request.id">
          <th class="index-cell">{{ request.id }}</th>
          <td>{{ request.supplier?.name?.ar || request.supplier?.LocalizedName || '—' }}</td>
          <td>{{ request.supplier?.supplierTypeLocalized?.name || '—' }}</td>
          <td>{{ request.supplier?.phone || '—' }}</td>
          <td>{{ request.supplier?.email || '—' }}</td>
          <td>{{ formatDate(request.created_at) }}</td>
          <td class="actions-cell">
            <button class="action-btn view" title="عرض" @click="handleView(request)">
              <IconsEye width="18" height="18" />
            </button>
          </td>
          <td class="actions-cell">
            <div>
              <button
                class="action-btn accept"
                title="قبول"
                @click="handleAccept(request)"
                :disabled="acceptingId === request.id"
              >
                <IconsCheck width="18" height="18" />
              </button>
              <button
                class="action-btn reject"
                title="رفض"
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
    :supplierId="selectedRequest?.id"
    @confirm="handleRejectConfirm"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'

const api = useApi()
const { success, error, warn } = useAppToast()

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

const headers = [
  { label: '#', class: 'index-cell' },
  { label: 'اسم المورد', class: '' },
  { label: 'نوع المورد', class: '' },
  { label: 'الهاتف', class: '' },
  { label: 'البريد الإلكتروني', class: '' },
  { label: 'تاريخ الطلب', class: '' },
  { label: 'الإجراءات', class: 'actions-cell' },
  { label: 'قبول / رفض', class: 'actions-cell' }
]

/* =============================
   FILTERS
============================== */
const searchFilters = computed(() => [
  {
    key: 'supplier_type_id',
    placeholder: 'نوع المورد',
    options: supplierTypeOptions.value
  }
])

const dateFilters = [
  { key: 'date', label: 'تاريخ الطلب' },
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
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

/* =============================
   FETCH SUPPLIER TYPES
============================== */
const fetchSupplierTypes = async () => {
  try {
    const res = await api('/v1/admin/supplier-types?per_page=100')
    supplierTypeOptions.value = (res.data || []).map(item => ({
      label: item.name?.ar || item.LocalizedName,
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
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())
    if (supplierTypeFilter.value) params.append('supplier_type_id', supplierTypeFilter.value)
    if (dateFilter.value) params.append('date', dateFilter.value)

    const res = await api(`/v1/admin/profile-update-requests?${params}`)
    requests.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
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
  console.log('view:', request)
}

const handleAccept = async (request) => {
  try {
    acceptingId.value = request.id
    await api('/v1/admin/change-supplier-status', {
      method: 'POST',
      body: {
        supplier_id: request.supplier?.id || request.id,
        status: 'approved'
      }
    })
    success(`تم قبول طلب التعديل بنجاح`)
    requests.value = requests.value.filter(r => r.id !== request.id)
  } catch (err) {
    console.error('Error accepting request:', err)
    error('حدث خطأ أثناء القبول، حاول مرة أخرى')
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
    await api('/v1/admin/change-supplier-status', {
      method: 'POST',
      body: {
        supplier_id: selectedRequest.value.supplier?.id || selectedRequest.value.id,
        status: 'rejected'
      }
    })
    warn('تم رفض طلب التعديل بنجاح')
    requests.value = requests.value.filter(r => r.id !== selectedRequest.value.id)
    close()
  } catch (err) {
    console.error('Error rejecting request:', err)
    error('حدث خطأ أثناء الرفض، حاول مرة أخرى')
  } finally {
    setLoading(false)
  }
}

/* =============================
   PAGINATION
============================== */
const handlePageChange = (page) => {
  const safePage = Math.max(1, Math.min(page, totalPages.value))
  if (safePage === currentPage.value) return
  currentPage.value = safePage
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