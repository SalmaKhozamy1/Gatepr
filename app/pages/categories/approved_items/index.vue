<template>
  <div>
    <Teleport to="#search-teleport-target">
      <SearchBar
        :placeholder="t('placeholders.search')"
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
        <tr v-if="!loading && items.length === 0">
          <td :colspan="headers.length" class="text-center py-5 no-data">
            {{ t('common.no_results_found') }}
          </td>
        </tr>

        <tr v-for="item in items" :key="item.id">
          <th class="index-cell">{{ item.id }}</th>
          <td>{{ item.supplier?.LocalizedName || '—' }}</td>
          <td>{{ item.category?.LocalizedName || '—' }}</td>
          <td>{{ item.name?.ar || '—' }}</td>
          <td class="nowrap">{{ formatDate(item.created_at) }}</td>
          <td class="nowrap">{{ formatDate(item.accepted_at) }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" :title="t('common.view')" @click="handleView(item.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn download" :title="t('common.download')" @click="handleDownload(item.id)" :disabled="downloadLoading === item.id">
                <IconsDownload width="18" height="18" v-if="downloadLoading !== item.id" />
                <span class="spinner-border spinner-border-sm" v-else></span>
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>
  </div>

  <ModalsAppViewModal
    v-model="showViewModal"
    :title="t('items.view_details')"
    :data="selectedItem"
    :fields="itemViewFields"
  />
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
usePageMeta('menu.categories')

import { ref, computed, onMounted, inject, onUnmounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const api = useApi()
const { error } = useAppToast()

const registerPageAction = inject('registerPageAction')
const unregisterPageAction = inject('unregisterPageAction')

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const actionTypeFilter = ref(null)
const createdDateFilter = ref('')
const acceptedDateFilter = ref('')
const items = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)
const viewLoading = ref(false)
const downloadLoading = ref(null)

const showViewModal = ref(false)
const selectedItem = ref(null)

const headers = computed(() => [
  { label: t('items.id'),              class: 'index-cell' },
  { label: t('items.supplier_name'),    class: '' },
  { label: t('items.category'),       class: '' },
  { label: t('items.name'),     class: '' },
  { label: t('items.request_date'),   class: '' },
  { label: t('items.approval_date'),  class: '' },
  { label: t('items.actions'),     class: 'actions-cell' },
])

/* =============================
   VIEW FIELDS
============================== */
const itemViewFields = computed(() => [
  { label: t('items.code'),                 key: 'code' },
  { label: t('items.name_ar'),              key: 'name.ar' },
  { label: t('items.name_en'),              key: 'name.en' },
  { label: t('items.supplier'),             key: 'supplier.LocalizedName' },
  { label: t('items.category'),             key: 'category.LocalizedName' },
  { label: t('items.branch'),               key: 'branch.LocalizedName' },
  { label: t('items.purchasing_unit'),      key: 'purchasingUnit.LocalizedName' },
  { label: t('items.receipt_type'),         key: 'receiptType.LocalizedName' },
  { label: t('items.supplier_price'),       key: 'supplier_price' },
  { label: t('items.profit_margin'),        key: 'profit_margin' },
  { label: t('items.unit_price'),           key: 'unit_price' },
  { label: t('items.packet_price'),         key: 'packet_price' },
  { label: t('items.carton_price'),         key: 'carton_price' },
  { label: t('items.weight'),               key: 'weight' },
  { label: t('items.size_volume'),          key: 'size_volume' },
  { label: t('items.association_discount'), key: 'association_discount' },
  { label: t('items.consumer_discount'),    key: 'consumer_discount' },
  { label: t('items.supply_intensity'),     key: 'supply_intensity' },
  { label: t('items.packet_intensity'),     key: 'packet_intensity' },
  { label: t('items.carton_intensity'),     key: 'carton_intensity' },
  { label: t('items.unit_barcode'),         key: 'unit_barcode' },
  { label: t('items.packet_barcode'),       key: 'packet_barcode' },
  { label: t('items.carton_barcode'),       key: 'carton_barcode' },
  { label: t('items.status'),               key: 'status_text' },
  { label: t('items.created_at'),           key: 'created_at' },
  { label: t('items.approval_date'),        key: 'accepted_at' },
])

const actionTypeOptions = computed(() => [
  { label: t('items.add'),    value: 'add' },
  { label: t('items.update'), value: 'update' },
  { label: t('items.delete'), value: 'delete' },
])

/* =============================
   FILTERS
============================== */
const searchFilters = computed(() => [
  {
    key: 'action_type',
    placeholder: t('items.request_status'),
    options: actionTypeOptions.value
  }
])

const dateFilters = [
  { key: 'created_date',  label: t('items.request_date') },
  { key: 'accepted_date', label: t('items.approval_date') },
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
    lastPage:    getValue(meta.last_page),
    currentPage: getValue(meta.current_page),
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return dateStr.split(' ')[0]
}

/* =============================
   FETCH ITEMS
============================== */
const fetchItems = async () => {
  try {
    loading.value = true

    const params = new URLSearchParams()
    params.append('page', currentPage.value)
    params.append('per_page', perPage)
    params.append('sort', '-created_at')

    if (searchQuery.value.trim())   params.append('search', searchQuery.value.trim())
    if (actionTypeFilter.value)     params.append('action_type', actionTypeFilter.value)
    if (createdDateFilter.value)    params.append('created_date', createdDateFilter.value)
    if (acceptedDateFilter.value)   params.append('accepted_date', acceptedDateFilter.value)

    const res = await api(`/v1/admin/items/approved?${params}`)
    items.value = res.data || []

    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1

  } catch (err) {
    console.error('Error fetching items:', err)
    items.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

/* =============================
   ACTIONS
============================== */
const handleView = async (id) => {
  try {
    viewLoading.value = true
    const res = await api(`/v1/admin/items/${id}`)
    selectedItem.value = res.data || null
    showViewModal.value = true
  } catch (err) {
    console.error('Error fetching item details:', err)
    error(t('items.messages.fetch_error'))
  } finally {
    viewLoading.value = false
  }
}

const handleDownload = async (id) => {
  try {
    downloadLoading.value = id
    const res = await api(`/v1/admin/items/${id}/export`)
    if (res.success && res.file_url) {
      window.open(res.file_url, '_blank')
    } else {
      error(t('items.messages.download_error'))
    }
  } catch (err) {
    console.error('Error exporting item:', err)
    error(t('items.messages.download_error'))
  } finally {
    downloadLoading.value = null
  }
}

const handleExportAll = async () => {
  try {
    const params = new URLSearchParams()
    if (categoryFilter.value) params.append('category_id', categoryFilter.value)
    if (acceptedDateFilter.value) params.append('accredited_date', acceptedDateFilter.value)

    const res = await api(`/v1/admin/items/export-accredited?${params}`)
    if (res.success && res.file_url) {
      window.open(res.file_url, '_blank')
    } else {
      error(t('items.messages.export_error'))
    }
  } catch (err) {
    console.error('Export all error:', err)
    error(t('items.messages.export_error'))
  }
}

/* =============================
   PAGINATION
============================== */
const handlePageChange = (page) => {
  const safePage = Math.max(1, Math.min(page, totalPages.value))
  if (safePage === currentPage.value) return
  currentPage.value = safePage
  fetchItems()
}

/* =============================
   SEARCH & FILTER
============================== */
const handleFilter = ({ search, action_type, created_date, accepted_date } = {}) => {
  searchQuery.value = search ?? ''
  actionTypeFilter.value = action_type || null
  createdDateFilter.value = created_date || ''
  acceptedDateFilter.value = accepted_date || ''
  currentPage.value = 1
  fetchItems()
}

const resetFilters = () => {
  searchQuery.value = ''
  actionTypeFilter.value = null
  createdDateFilter.value = ''
  acceptedDateFilter.value = ''
  currentPage.value = 1
  fetchItems()
}

/* =============================
   LIFECYCLE
============================== */
onMounted(() => {
  fetchItems()
  registerPageAction?.('download', handleExportAll)
})

onUnmounted(() => {
  unregisterPageAction?.('download')
})
</script>