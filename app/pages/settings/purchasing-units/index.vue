<template>
  <div>
    <Teleport to="#search-teleport-target">
      <div class="flex-start gap-sm w-100 flex-wrap">
        <SearchBar
          placeholder="بحث عن وحدة شراء .."
          @filter="handleFilter"
          @reset="resetFilters"
        />
      </div>
    </Teleport>

    <TablesAppTable
      :headers="headers"
      :current-page="currentPage"
      :total-pages="totalPages"
      :loading="loading"
      @update:current-page="handlePageChange"
    >
      <template #body>
        <tr v-if="!loading && purchasingUnits.length === 0">
          <td :colspan="headers.length" class="text-center">
            لا توجد وحدات شراء للعرض
          </td>
        </tr>

        <tr v-for="unit in purchasingUnits" :key="unit.id">
          <th class="index-cell">{{ unit.id }}</th>
          <td>{{ unit.name?.ar }}</td>
          <td>{{ unit.code }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" title="عرض" @click="handleView(unit.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" title="تعديل" @click="handleEdit(unit)">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" title="حذف" @click="handleDelete(unit)">
                <IconsDelete width="18" height="18" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>
  </div>

  <ModalsAppViewModal
    v-model="showViewModal"
    title="عرض وحدة شراء"
    :data="selectedUnit"
    :fields="unitViewFields"
    :icon="IconsUnits"
  />

  <ModalsAppAddModal
    v-model="showAddModal"
    title="إضافة وحدة شراء"
    :icon="IconsUnits"
    :fields="unitFormFields"
    @submit="handleAddSubmit"
  />

  <ModalsAppEditModal
    v-model="showEditModal"
    title="تعديل وحدة شراء"
    :icon="IconsUnits"
    :fields="unitFormFields"
    :initial-data="selectedEditUnit"
    @submit="handleEditSubmit"
  />

  <ModalsAppDeleteModal
    v-model="showDeleteModal"
    title="حذف وحدة الشراء"
    itemType="وحدة شراء"
    :itemName="selectedDeleteUnit?.name?.ar"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { IconsUnits } from '#components'

const api = useApi()
const { viewItem, loading: viewLoading } = useView()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const purchasingUnits = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)

const showViewModal = ref(false)
const selectedUnit = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEditUnit = ref(null)
const showDeleteModal = ref(false)
const selectedDeleteUnit = ref(null)

const headers = [
  { label: '#', class: 'index-cell' },
  { label: 'اسم الوحدة', class: '' },
  { label: 'الكود', class: '' },
  { label: 'الإجراءات', class: 'actions-cell' }
]

const unitViewFields = [
  { label: 'الاسم بالعربي', key: 'name.ar' },
  { label: 'الاسم بالإنجليزي', key: 'name.en' },
  { label: 'الكود', key: 'code' },
]

const unitFormFields = [
  { key: 'name.ar', label: 'الاسم بالعربي', placeholder: 'ادخل الاسم باللغة العربية' },
  { key: 'name.en', label: 'الاسم بالإنجليزي', placeholder: 'ادخل الاسم باللغة الإنجليزية' },
  { key: 'code', label: 'الكود', placeholder: '12345678', type: 'text' },
]

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

/* =============================
   FETCH DATA
============================== */
const fetchPurchasingUnits = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: 'created_at',
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())

    const res = await api(`/v1/admin/purchasing-units?${params}`)
    purchasingUnits.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
  } catch (err) {
    console.error('Error fetching purchasing units:', err)
    purchasingUnits.value = []
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
    const data = await viewItem('purchasing-units', id)
    selectedUnit.value = data
    showViewModal.value = true
  } catch (err) {
    console.error('Error viewing purchasing unit:', err)
  }
}

const handleAddSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api('/v1/admin/purchasing-units', {
      method: 'POST',
      body: data
    })
    close()
    fetchPurchasingUnits()
  } catch (err) {
    if (err?.data?.errors) {
      const apiErrors = {}
      Object.entries(err.data.errors).forEach(([key, messages]) => {
        apiErrors[key] = messages[0]
      })
      setErrors(apiErrors)
    }
  } finally {
    setLoading(false)
  }
}

const handleEdit = (unit) => {
  selectedEditUnit.value = unit
  showEditModal.value = true
}

const handleEditSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/purchasing-units/${selectedEditUnit.value.id}`, {
      method: 'PUT',
      body: data
    })
    close()
    fetchPurchasingUnits()
  } catch (err) {
    if (err?.data?.errors) {
      const apiErrors = {}
      Object.entries(err.data.errors).forEach(([key, messages]) => {
        apiErrors[key] = messages[0]
      })
      setErrors(apiErrors)
    }
  } finally {
    setLoading(false)
  }
}

const handleDelete = (unit) => {
  selectedDeleteUnit.value = unit
  showDeleteModal.value = true
}

const handleDeleteConfirm = async ({ setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/purchasing-units/${selectedDeleteUnit.value.id}`, {
      method: 'DELETE'
    })
    close()
    fetchPurchasingUnits()
  } catch (err) {
    console.error('Error deleting purchasing unit:', err)
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
const handleFilter = ({ search } = {}) => {
  searchQuery.value = search ?? ''
  currentPage.value = 1
  fetchPurchasingUnits()
}

const resetFilters = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchPurchasingUnits()
}

/* =============================
   PROVIDE/INJECT
============================== */
const registerAddModal = inject('registerAddModal')
const unregisterAddModal = inject('unregisterAddModal')

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchPurchasingUnits())

onMounted(() => {
  fetchPurchasingUnits()
  registerAddModal?.(() => { showAddModal.value = true })
})

onBeforeUnmount(() => {
  unregisterAddModal?.()
})
</script>