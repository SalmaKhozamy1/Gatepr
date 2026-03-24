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
          <td>
            <span :class="['action-badge', getActionType(item.action_type).class]">
              {{ t('items.' + item.action_type) }}
            </span>
          </td>
          <td class="actions-cell">
            <button
              class="action-btn view"
              :title="t('common.view')"
              @click="handleView(item.id)"
              :disabled="viewLoading"
            >
              <IconsEye width="18" height="18" />
            </button>
          </td>
          <td class="actions-cell">
            <div>
              <button
                class="action-btn accept"
                :title="t('buttons.accept')"
                @click="handleAccept(item)"
                :disabled="acceptingId === item.id || item.supplier?.active === 'no'"
              >
                <IconsCheck width="18" height="18" />
              </button>
              <button
                class="action-btn reject"
                :title="t('buttons.reject')"
                @click="handleReject(item)"
                :disabled="item.supplier?.active === 'no'"
              >
                <IconsCross width="18" height="18" />
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
  >
    <template #footer v-if="selectedItem">
      <button
        class="custom-btn danger-btn"
        @click="handleRejectFromModal"
        :disabled="selectedItem.supplier?.active === 'no'"
      >
        <IconsCross />
        <span>{{ t('buttons.reject') }}</span>
      </button>
      <button
        class="custom-btn success-btn"
        @click="handleAcceptFromModal"
        :disabled="acceptingId === selectedItem.id || selectedItem.supplier?.active === 'no'"
      >
        <IconsCheck />
        <span>{{ t('buttons.accept') }}</span>
      </button>
    </template>
  </ModalsAppViewModal>

  <ModalsAppRejectModal
    v-model="showRejectModal"
    @confirm="handleRejectConfirm"
  />
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
usePageMeta('menu.categories')

import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const api = useApi()
const { success, error, warn } = useAppToast()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const categoryFilter = ref(null)
const actionTypeFilter = ref(null)
const dateFilter = ref('')
const categoryOptions = ref([])
const items = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)
const acceptingId = ref(null)
const viewLoading = ref(false)

const showViewModal = ref(false)
const selectedItem = ref(null)
const showRejectModal = ref(false)
const selectedRejectItem = ref(null)

const headers = computed(() => [
  { label: t('items.id'),           class: 'index-cell' },
  { label: t('items.supplier_name'), class: '' },
  { label: t('items.category'),    class: '' },
  { label: t('items.name'),  class: '' },
  { label: t('items.request_date'),class: '' },
  { label: t('items.request_type'),  class: '' },
  { label: t('items.actions'),  class: 'actions-cell' },
  { label: t('items.accept_reject'), class: 'actions-cell' },
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
])

/* =============================
   FILTERS
============================== */
const actionTypeOptions = computed(() => [
  { label: t('items.add'),    value: 'add' },
  { label: t('items.update'), value: 'update' },
  { label: t('items.delete'), value: 'delete' },
])

const actionTypeMap = {
  create: { class: 'badge-add' },
  add:    { class: 'badge-add' },
  update: { class: 'badge-update' },
  delete: { class: 'badge-delete' },
}

const getActionType = (type) => actionTypeMap[type] ?? { class: '' }

const searchFilters = computed(() => [
  {
    key: 'category_id',
    placeholder: t('items.category'),
    options: categoryOptions.value
  },
  {
    key: 'action_type',
    placeholder: t('items.request_type'),
    options: actionTypeOptions.value
  }
])

const dateFilters = [
  { key: 'date', label: t('labels.date') },
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
   FETCH CATEGORIES
============================== */
const fetchCategories = async () => {
  try {
    const res = await api('/v1/admin/categories?per_page=100')
    categoryOptions.value = (res.data || []).map(item => ({
      label: item.LocalizedName || item.name?.ar || item.name,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching categories:', err)
    categoryOptions.value = []
  }
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

    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())
    if (categoryFilter.value)    params.append('category_id', categoryFilter.value)
    if (actionTypeFilter.value)  params.append('action_type', actionTypeFilter.value)
    if (dateFilter.value)        params.append('created_date', dateFilter.value)

    const res = await api(`/v1/admin/items?${params}`)
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

// ✅ Accept — POST /items/approve با ids array
const handleAccept = async (item) => {
  try {
    acceptingId.value = item.id
    await api('/v1/admin/items/approve', {
      method: 'POST',
      body: { ids: [item.id] }
    })
    success(t('items.messages.accept_success'))
    items.value = items.value.filter(i => i.id !== item.id)
  } catch (err) {
    console.error('Error accepting item:', err)
    error(err?.data?.message || t('items.messages.accept_error'))
  } finally {
    acceptingId.value = null
  }
}

// ✅ Reject — بيفتح الـ modal
const handleReject = (item) => {
  selectedRejectItem.value = item
  showRejectModal.value = true
}

const handleAcceptFromModal = async () => {
  if (!selectedItem.value) return
  await handleAccept(selectedItem.value)
  showViewModal.value = false
}

const handleRejectFromModal = () => {
  if (!selectedItem.value) return
  handleReject(selectedItem.value)
  showViewModal.value = false
}

// ✅ Reject Confirm — بيتعامل مع واحد أو كل الـ items
const handleRejectConfirm = async ({ reason, setLoading, close }) => {
  try {
    setLoading(true)

    const ids = selectedRejectItem.value?._allIds
      ?? [selectedRejectItem.value?.id]

    await api('/v1/admin/items/reject', {
      method: 'POST',
      body: { ids, reason }
    })

    const count = ids.length
    warn(count > 1 ? t('items.messages.reject_count_success', { count }) : t('items.messages.reject_success'))
    items.value = items.value.filter(i => !ids.includes(i.id))
    close()
  } catch (err) {
    console.error('Error rejecting item:', err)
    error(err?.data?.message || t('items.messages.reject_error'))
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
  fetchItems()
}

/* =============================
   SEARCH & FILTER
============================== */
const handleFilter = ({ search, category_id, action_type, date } = {}) => {
  searchQuery.value = search ?? ''
  categoryFilter.value = category_id || null
  actionTypeFilter.value = action_type || null
  dateFilter.value = date || ''
  currentPage.value = 1
  fetchItems()
}

const resetFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = null
  actionTypeFilter.value = null
  dateFilter.value = ''
  currentPage.value = 1
  fetchItems()
}

/* =============================
   PROVIDE/INJECT
============================== */
const registerPageAction = inject('registerPageAction')
const unregisterPageAction = inject('unregisterPageAction')

// ✅ Accept All — بيبعت كل الـ ids مرة واحدة
const handleAcceptAll = async () => {
  if (!items.value.length) return
  try {
    const ids = items.value.map(i => i.id)
    await api('/v1/admin/items/approve', {
      method: 'POST',
      body: { ids }
    })
    success(t('items.messages.accept_all_success', { count: ids.length }))
    fetchItems()
  } catch (err) {
    console.error('Error accepting all:', err)
    error(err?.data?.message || t('items.messages.accept_all_error'))
  }
}

// ✅ Reject All — بيفتح الـ modal مع كل الـ ids
const handleRejectAll = () => {
  if (!items.value.length) return
  selectedRejectItem.value = { _allIds: items.value.map(i => i.id) }
  showRejectModal.value = true
}

onMounted(() => {
  fetchItems()
  fetchCategories()
  registerPageAction?.('acceptAll', handleAcceptAll)
  registerPageAction?.('rejectAll', handleRejectAll)
})

onBeforeUnmount(() => {
  unregisterPageAction?.('acceptAll')
  unregisterPageAction?.('rejectAll')
})
</script>
