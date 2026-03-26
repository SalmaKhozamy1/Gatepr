<template>
  <PageLayout
    :hasAside="false"
    :formTitle="t('items.add_form.title_list')"
  >
    <!-- Search / Filter -->
    <template #search>
      <SearchBar
        placeholder="بحث .."
        :filters="searchFilters"
        :loading="loading"
        @filter="handleFilter"
        @reset="resetFilters"
      />
    </template>

    <!-- Header Actions -->
    <template #header-actions>
      <div class="flex-start gap-sm">
        <button class="custom-btn gray-btn">
          <span style="font-size: 20px">+</span> {{ t('items.import') }}
        </button>
        <button
          class="custom-btn primary-btn"
          @click="$router.push(localePath('/item-managment/add'))"
        >
          <span style="font-size: 20px">+</span> {{ t('items.create_request') }}
        </button>
      </div>
    </template>

    <!-- Table content -->
    <template #main>
      <TablesAppTable
        :headers="headers"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="perPage"
        :loading="loading"
        @update:current-page="handlePageChange"
      >
        <template #body="{ getIndex }">
          <tr v-if="!loading && itemsList.length === 0">
            <td :colspan="headers.length" class="text-center danger">
              {{ t('common.no_results_found') }}
            </td>
          </tr>

          <tr v-for="(item, index) in itemsList" :key="item.id">
            <th class="index-cell">{{ getIndex(index) }}</th>
            <td>{{ item.code || '—' }}</td>
            <td>{{ item.name?.[locale] || item.name?.ar || item.LocalizedName || '—' }}</td>
            <td>{{ item.code || '—' }}</td>
            <td>{{ item.category?.name?.[locale] || item.category?.name?.ar || item.category?.LocalizeName || '—' }}</td>
            <td>
              <span class="status" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="d-flex align-items-center gap-2">
                <button
                  class="action-btn view"
                  :title="t('common.view')"
                  @click="handleView(item.id)"
                >
                  <IconsEye width="18" height="18" />
                </button>
                <button
                  v-if="item.can_edit"
                  class="action-btn edit"
                  :title="t('common.edit')"
                  @click="handleEdit(item)"
                >
                  <IconsEdit width="18" height="18" />
                </button>
                <button
                  v-if="item.can_export"
                  class="action-btn view"
                  :title="t('buttons.download')"
                >
                  <IconsDownload width="18" height="18" />
                </button>
                <button
                  v-if="item.can_delete"
                  class="action-btn delete"
                  :title="t('common.delete')"
                  @click="handleDelete(item)"
                >
                  <IconsDelete width="18" height="18" />
                </button>
              </div>
            </td>
          </tr>
        </template>
      </TablesAppTable>
    </template>
  </PageLayout>

  <!-- View Modal -->
  <ModalsAppViewModal
    v-model="showViewModal"
    :title="t('items.view_details')"
    :data="selectedItem"
    :sections="itemViewSections"
    :icon="IconsTerms"
  />

  <!-- Delete Modal -->
  <ModalsAppDeleteModal
    v-model="showDeleteModal"
    :title="t('items.delete') + ' ' + t('items.request')"
    itemType="الصنف"
    :itemName="selectedDeleteItem?.name?.ar || selectedDeleteItem?.LocalizedName"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
usePageMeta('menu.item-managment')

import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { useI18n } from 'vue-i18n'
import { IconsTerms, IconsInformation, IconsDiscount, IconsMeasurement, IconsInfo, IconsPrice, IconsBarCode } from '#components'

const { t, locale } = useI18n()
const api = useApi()
const { viewItem, loading: viewLoading } = useView()
const localePath = useLocalePath()

/* =============================
   STATE
============================== */
const itemsList = ref([])
const loading = ref(false)

const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15

const searchQuery = ref('')
const categoryFilter = ref(null)
const statusFilter = ref(null)

const showViewModal = ref(false)
const selectedItem = ref(null)

const showDeleteModal = ref(false)
const selectedDeleteItem = ref(null)

const showEditModal = ref(false)
const selectedEditItem = ref(null)

/* =============================
   COMPUTED
============================== */
const headers = computed(() => [
  { label: '#', class: 'index-cell' },
  { label: t('items.code'), class: '' },
  { label: t('items.name'), class: '' },
  { label: t('items.code'), class: '' },
  { label: t('items.category'), class: '' },
  { label: t('items.request_status'), class: '' },
  { label: t('common.actions'), class: 'actions-cell' }
])

const itemViewSections = computed(() => [
  {
    label: t('items.add_form.item_details'),
    icon: IconsInformation,
    fields: [
      { label: t('items.add_form.labels.item_number'), key: 'code' },
      { label: t('items.add_form.labels.name_ar'), key: 'name' },
      { label: t('items.add_form.labels.supplier_code'), key: 'supplier_code' },
      { label: t('items.add_form.labels.sub_category'), key: 'category.name' },
      { label: t('items.add_form.labels.weight'), key: 'weight' },
      { label: t('items.add_form.labels.volume'), key: 'size_volume' },
    ]
  },
  {
    label: t('items.add_form.financial_info'),
    icon: IconsInformation,
    fields: [
      { label: t('items.add_form.labels.profit_margin'), key: 'profit_margin' },
      { label: t('items.add_form.labels.supplier_price'), key: 'supplier_price' },
    ]
  },
  {
    label: t('items.add_form.discounts'),
    icon: IconsDiscount,
    fields: [
      { label: t('items.add_form.labels.consumer_discount'), key: 'consumer_discount' },
      { label: t('items.add_form.labels.association_discount'), key: 'association_discount' },
    ]
  },
  {
    label: t('items.add_form.measuring_units'),
    icon: IconsMeasurement,
    fields: [
      { label: t('items.add_form.labels.purchasing_unit'), key: 'purchasingUnit.name' },
    ]
  },
  {
    label: t('items.add_form.packaging_info'),
    icon: IconsInfo,
    fields: [
      { label: t('items.add_form.labels.supply_intensity'), key: 'supply_intensity' },
      { label: t('items.add_form.labels.packet_intensity'), key: 'packet_intensity' },
      { label: t('items.add_form.labels.carton_intensity'), key: 'carton_intensity' },
    ]
  },
  {
    label: t('items.add_form.prices'),
    icon: IconsPrice,
    fields: [
      { label: t('items.add_form.labels.unit_price'), key: 'unit_price' },
      { label: t('items.add_form.labels.packet_price'), key: 'packet_price' },
      { label: t('items.add_form.labels.carton_price'), key: 'carton_price' },
    ]
  },
  {
    label: t('items.add_form.barcodes'),
    icon: IconsBarCode,
    fields: [
      { label: t('items.add_form.labels.unit_barcode'), key: 'unit_barcode' },
      { label: t('items.add_form.labels.packet_barcode'), key: 'packet_barcode' },
      { label: t('items.add_form.labels.carton_barcode'), key: 'carton_barcode' },
    ]
  },
])

const searchFilters = computed(() => [
  {
    key: 'category_id',
    placeholder: 'التصنيفات',
    options: [] // يمكن ربطها بـ API لاحقاً
  },
  {
    key: 'status',
    placeholder: 'حالة الطلب',
    options: [
      { label: 'قيد الإنتظار', value: 'pending' },
      { label: 'مقبول', value: 'accepted' },
      { label: 'مرفوض', value: 'rejected' }
    ]
  }
])

/* =============================
   HELPER
============================== */
const parseMeta = (meta = {}) => {
  const getValue = (val) => {
    if (Array.isArray(val)) return val[0] ?? 1
    return val ?? 1
  }
  return {
    lastPage: getValue(meta.last_page),
    currentPage: getValue(meta.current_page),
    total: getValue(meta.total),
    perPage: getValue(meta.per_page),
  }
}

const getStatusClass = (status) => {
  if (status === 'pending') return 'status-pending'
  if (status === 'accepted') return 'success-status'
  if (status === 'rejected') return 'status-danger'
}

const getStatusText = (status) => {
  if (status === 'pending') return t('items.status.pending')
  if (status === 'accepted') return t('items.status.accepted')
  if (status === 'rejected') return t('items.status.rejected')
  return '—'
}

/* =============================
   FETCH ITEMS
============================== */
const fetchItems = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())
    if (categoryFilter.value) params.append('category_id', categoryFilter.value)
    if (statusFilter.value) params.append('status', statusFilter.value)

    const res = await api(`/items?${params}`)
    itemsList.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
  } catch (err) {
    console.error('Error fetching items:', err)
    itemsList.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
    console.log('itemsList', itemsList.value)
  }
}

/* =============================
   ACTIONS
============================== */
const handleView = async (id) => {
  try {
    const data = await viewItem('items', id)
    selectedItem.value = data
    showViewModal.value = true
  } catch (err) {
    console.error('Error viewing item:', err)
  }
}

const handleEdit = (item) => {
  navigateTo(localePath(`/item-managment/edit/${item.id}`))
}

const handleDelete = (item) => {
  selectedDeleteItem.value = item
  showDeleteModal.value = true
}

const handleDeleteConfirm = async ({ setLoading, close }) => {
  try {
    setLoading(true)
    const res = await api(`/items/${selectedDeleteItem.value.id}`, {
      method: 'DELETE'
    })
    console.log('response');
    close()
    fetchItems()
  } catch (err) {
    console.error('Error deleting item:', err)
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
const handleFilter = ({ search, category_id, status } = {}) => {
  searchQuery.value = search ?? ''
  categoryFilter.value = category_id || null
  statusFilter.value = status || null
  currentPage.value = 1
  fetchItems()
}

const resetFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = null
  statusFilter.value = null
  currentPage.value = 1
  fetchItems()
}

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchItems())

onMounted(() => {
  fetchItems().catch(console.error)
})
</script>
