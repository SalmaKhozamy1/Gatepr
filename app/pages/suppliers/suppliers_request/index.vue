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
        <tr v-if="!loading && suppliers.length === 0">
          <td :colspan="headers.length" class="text-center">
            لا يوجد موردين للعرض
          </td>
        </tr>

        <tr v-for="supplier in suppliers" :key="supplier.id">
          <th class="index-cell">{{ supplier.id }}</th>
          <td>{{ supplier.name?.ar || supplier.LocalizedName }}</td>
          <td>{{ supplier.supplierTypeLocalized?.name || '—' }}</td>
          <td>{{ supplier.phone || '—' }}</td>
          <td>{{ supplier.email || '—' }}</td>
          <td>{{ formatDate(supplier.created_at) }}</td>
          <td class="actions-cell">
            <button class="action-btn view" title="عرض" @click="handleView(supplier)">
              <IconsEye width="18" height="18" />
            </button>
          </td>
          <td class="actions-cell">
            <div>
              <button
                class="action-btn accept"
                title="قبول"
                @click="handleAccept(supplier)"
                :disabled="acceptingId === supplier.id"
              >
                <IconsCheck width="18" height="18" />
              </button>
              <button
                class="action-btn reject"
                title="رفض"
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
    key: 'supplier_type',
    placeholder: 'نوع المورد',
    options: supplierTypeOptions.value
  }
])

const dateFilters = [
  { key: 'created_date', label: 'تاريخ الطلب' },
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
   FETCH SUPPLIERS
============================== */
const fetchSuppliers = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: '-created_at',
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())
    if (supplierTypeFilter.value) params.append('supplier_type_id', supplierTypeFilter.value)
    if (createdDateFilter.value) params.append('created_date', createdDateFilter.value)

    const res = await api(`/v1/admin/suppliers?${params}`)
    suppliers.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
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
    await api('/v1/admin/change-supplier-status', {
      method: 'POST',
      body: {
        supplier_id: supplier.id,
        status: 'approved'
      }
    })
    success(`تم قبول طلب ${supplier.name?.ar || supplier.LocalizedName} بنجاح`)
    fetchSuppliers()
  } catch (err) {
    console.error('Error accepting supplier:', err)
    error('حدث خطأ أثناء القبول، حاول مرة أخرى')
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
        status: 'rejected'
      }
    })
    warn(`تم رفض طلب ${selectedSupplier.value.name?.ar} بنجاح`)
    close()
    fetchSuppliers()
  } catch (err) {
    console.error('Error rejecting supplier:', err)
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
const handleFilter = ({ search, supplier_type, created_date } = {}) => {
  searchQuery.value = search ?? ''
  supplierTypeFilter.value = supplier_type || null
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