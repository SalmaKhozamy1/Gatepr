<template>
  <div>
    <Teleport to="#search-teleport-target">
      <SearchBar
        placeholder="بحث .."
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
          <td :colspan="headers.length" class="text-center">
            لا توجد أصناف للعرض
          </td>
        </tr>

        <tr v-for="item in items" :key="item.id">
          <th class="index-cell">{{ item.id }}</th>
          <td>{{ item.supplier?.name?.ar || '—' }}</td>
          <td>{{ item.category?.name?.ar || '—' }}</td>
          <td>{{ item.name?.ar || '—' }}</td>
          <td>{{ formatDate(item.created_at) }}</td>
          <td>{{ item.action_type || '—' }}</td>
          <td class="actions-cell">
            <button class="action-btn view" title="عرض" @click="handleView(item)">
              <IconsEye width="18" height="18" />
            </button>
          </td>
          <td class="actions-cell">
            <div>
              <button
                class="action-btn accept"
                title="قبول"
                @click="handleAccept(item)"
                :disabled="acceptingId === item.id"
              >
                <IconsCheck width="18" height="18" />
              </button>
              <button
                class="action-btn reject"
                title="رفض"
                @click="handleReject(item)"
              >
                <IconsCross width="18" height="18" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>
  </div>

  <ModalsAppRejectModal
    v-model="showRejectModal"
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

const showRejectModal = ref(false)
const selectedItem = ref(null)

const headers = [
  { label: '#', class: 'index-cell' },
  { label: 'اسم المورد', class: '' },
  { label: 'التصنيف', class: '' },
  { label: 'اسم الصنف', class: '' },
  { label: 'تاريخ الطلب', class: '' },
  { label: 'نوع الطلب', class: '' },
  { label: 'الإجراءات', class: 'actions-cell' },
  { label: 'قبول / رفض', class: 'actions-cell' },
]

/* =============================
   FILTERS
============================== */
const actionTypeOptions = [
  { label: 'إضافة', value: 'create' },
  { label: 'تعديل', value: 'update' },
  { label: 'حذف', value: 'delete' },
]

const searchFilters = computed(() => [
  {
    key: 'category_id',
    placeholder: 'التصنيف',
    options: categoryOptions.value
  },
  {
    key: 'action_type',
    placeholder: 'نوع الطلب',
    options: actionTypeOptions
  }
])

const dateFilters = [
  { key: 'date', label: 'التاريخ' },
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
   FETCH CATEGORIES
============================== */
const fetchCategories = async () => {
  try {
    const res = await api('/v1/admin/categories?per_page=100')
    categoryOptions.value = (res.data || []).map(item => ({
      label: item.name?.ar,
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
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: '-created_at',
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())
    if (categoryFilter.value) params.append('category_id', categoryFilter.value)
    if (actionTypeFilter.value) params.append('action_type', actionTypeFilter.value)
    if (dateFilter.value) params.append('date', dateFilter.value)

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
const handleView = (item) => {
  console.log('view:', item)
}

const handleAccept = async (item) => {
  try {
    acceptingId.value = item.id
    // ✅ هنربطها بالـ API لما تكون جاهزة
    // await api(`/v1/admin/items/${item.id}/approve`, { method: 'POST' })
    success('تم قبول الصنف بنجاح')
    items.value = items.value.filter(i => i.id !== item.id)
  } catch (err) {
    console.error('Error accepting item:', err)
    error('حدث خطأ أثناء القبول، حاول مرة أخرى')
  } finally {
    acceptingId.value = null
  }
}

const handleReject = (item) => {
  selectedItem.value = item
  showRejectModal.value = true
}

const handleRejectConfirm = async ({ reason, setLoading, close }) => {
  try {
    setLoading(true)
    // ✅ هنربطها بالـ API لما تكون جاهزة
    // await api(`/v1/admin/items/${selectedItem.value.id}/reject`, { method: 'POST', body: { reason } })
    warn('تم رفض الصنف بنجاح')
    items.value = items.value.filter(i => i.id !== selectedItem.value.id)
    close()
  } catch (err) {
    console.error('Error rejecting item:', err)
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
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchItems())

onMounted(() => {
  fetchItems()
  fetchCategories()
})
</script>