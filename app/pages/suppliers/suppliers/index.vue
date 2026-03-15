<template>
  <div>
    <Teleport to="#search-teleport-target">
      <SearchBar
        placeholder="بحث عن مورد .."
        :filters="searchFilters"
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
          <td :colspan="headers.length" class="text-center">
            لا يوجد موردين للعرض
          </td>
        </tr>

        <tr v-for="(supplier, index) in suppliers" :key="supplier.id">
          <th class="index-cell">{{ getIndex(index) }}</th>
          <td>{{ supplier.name?.ar || supplier.LocalizedName }}</td>
          <td>{{ supplier.supplierTypeLocalized?.name || '—' }}</td>
          <td>{{ supplier.phone || '—' }}</td>
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
              <button class="action-btn view" title="عرض" @click="handleView(supplier)">
                <IconsEye width="18" height="18" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const togglingId = ref(null)

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const supplierTypeFilter = ref(null)
const supplierTypeOptions = ref([])
const suppliers = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)

const headers = [
  { label: '#', class: 'index-cell' },
  { label: 'اسم المورد', class: '' },
  { label: 'نوع المورد', class: '' },
  { label: 'الهاتف', class: '' },
  { label: 'البريد الإلكتروني', class: '' },
  { label: 'حالة المورد', class: '' },
  { label: 'الإجراءات', class: 'actions-cell' },
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

const statusLabel = (status) => {
  const map = {
    approved: 'مقبول',
    pending: 'معلق',
    rejected: 'مرفوض',
  }
  return map[status] || status
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
const handleFilter = ({ search, supplier_type } = {}) => {
  searchQuery.value = search ?? ''
  supplierTypeFilter.value = supplier_type || null
  currentPage.value = 1
  fetchSuppliers()
}

const resetFilters = () => {
  searchQuery.value = ''
  supplierTypeFilter.value = null
  currentPage.value = 1
  fetchSuppliers()
}

const handleToggleActive = async (supplier) => {
  try {
    togglingId.value = supplier.id

    // ✅ هنربطها بالـ API لما تكون جاهزة
    // await api(`/v1/admin/suppliers/${supplier.id}/toggle-active`, { method: 'POST' })

    // ✅ update محلي دلوقتي
    const index = suppliers.value.findIndex(s => s.id === supplier.id)
    if (index !== -1) {
      suppliers.value[index] = {
        ...suppliers.value[index],
        active: supplier.active === 'yes' ? 'no' : 'yes'
      }
    }
  } catch (err) {
    console.error('Error toggling supplier:', err)
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

<style scoped>
.status-badge {
  padding: 3px 12px;
  border-radius: 20px;
  font-size: var(--size-xs);
  font-weight: 500;
}

.status-badge.approved {
  background-color: color-mix(in srgb, var(--success-color, #10b981) 15%, transparent);
  color: var(--success-color, #10b981);
}

.status-badge.pending {
  background-color: color-mix(in srgb, var(--warning-color, #f59e0b) 15%, transparent);
  color: var(--warning-color, #f59e0b);
}

.status-badge.rejected {
  background-color: color-mix(in srgb, var(--danger-color, #ef4444) 15%, transparent);
  color: var(--danger-color, #ef4444);
}
</style>