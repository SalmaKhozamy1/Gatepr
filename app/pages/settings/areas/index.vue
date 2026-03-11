<template>
  <div>
    <Teleport to="#search-teleport-target">
      <div class="flex-start gap-sm w-100 flex-wrap">
      <SearchBar
        placeholder="بحث عن محافظة .."
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
        <tr v-if="!loading && areas.length === 0">
          <td :colspan="headers.length" class="text-center">
            لا توجد مناطق للعرض
          </td>
        </tr>

        <tr v-for="area in areas" :key="area.id">
          <th class="index-cell">{{ area.id }}</th>
          <td>{{ area.name?.ar }}</td>
          <td>{{ area.governorate?.name?.ar }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" title="عرض" @click="handleView(area.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" title="تعديل" @click="handleEdit(area)">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" title="حذف" @click="handleDelete(area)">
                <IconsDelete width="18" height="18" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>
  </div>

  <!-- View Modal -->
  <ModalsAppViewModal
    v-model="showViewModal"
    title="عرض منطقة"
    :data="selectedArea"
    :fields="areaViewFields"
    :icon="IconsSettingsRegions"
  />

  <!-- Add Modal -->
  <ModalsAppAddModal
    v-model="showAddModal"
    title="إضافة منطقة"
    :icon="IconsSettingsRegions"
    :fields="areaFormFields"
    @submit="handleAddSubmit"
  />

  <!-- Edit Modal -->
  <ModalsAppEditModal
    v-model="showEditModal"
    title="تعديل منطقة"
    :icon="IconsSettingsRegions"
    :fields="areaFormFields"
    :initial-data="selectedEditArea"
    @submit="handleEditSubmit"
  />

  <!-- Delete Modal -->
  <ModalsAppDeleteModal
    v-model="showDeleteModal"
    title="حذف المنطقة"
    itemType="منطقة"
    :itemName="selectedDeleteArea?.name?.ar"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { IconsSettingsRegions } from '#components'

const api = useApi()
const { viewItem, loading: viewLoading } = useView()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const areas = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)

const showViewModal = ref(false)
const selectedArea = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEditArea = ref(null)
const showDeleteModal = ref(false)
const selectedDeleteArea = ref(null)

const headers = [
  { label: '#', class: 'index-cell' },
  { label: 'اسم المنطقة', class: '' },
  { label: 'اسم المحافظة', class: '' },
  { label: 'الإجراءات', class: 'actions-cell' }
]

const areaViewFields = [
  { label: 'اسم المنطقة بالعربي', key: 'name.ar' },
  { label: 'اسم المنطقة بالإنجليزي', key: 'name.en' },
  { label: 'المحافظة', key: 'governorate.name.ar' },
]

const areaFormFields = [
  { key: 'name.ar', label: 'اسم المنطقة بالعربي', placeholder: 'ادخل اسم المنطقة باللغة العربية' },
  { key: 'name.en', label: 'اسم المنطقة بالإنجليزي', placeholder: 'ادخل اسم المنطقة باللغة الإنجليزية' },
  { key: 'governorate_id', label: 'المحافظة', placeholder: 'ادخل رقم المحافظة', type: 'number' },
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
const fetchAreas = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: 'created_at',
      with: 'governorate',   // ✅ لجلب بيانات المحافظة مع كل منطقة
    })
    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim())
    }
    const res = await api(`/v1/admin/areas?${params}`)
    areas.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
  } catch (err) {
    console.error('Error fetching areas:', err)
    areas.value = []
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
    const data = await viewItem('areas', id)
    selectedArea.value = data
    showViewModal.value = true
  } catch (err) {
    console.error('Error viewing area:', err)
  }
}

const handleAddSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api('/v1/admin/areas', {
      method: 'POST',
      body: data
    })
    close()
    fetchAreas()
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

const handleEdit = (area) => {
  selectedEditArea.value = area
  showEditModal.value = true
}

const handleEditSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/areas/${selectedEditArea.value.id}`, {
      method: 'PUT',
      body: data
    })
    close()
    fetchAreas()
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

const handleDelete = (area) => {
  selectedDeleteArea.value = area
  showDeleteModal.value = true
}

const handleDeleteConfirm = async ({ setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/areas/${selectedDeleteArea.value.id}`, {
      method: 'DELETE'
    })
    close()
    fetchAreas()
  } catch (err) {
    console.error('Error deleting area:', err)
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
const handleFilter = (query) => {
  searchQuery.value = query
  currentPage.value = 1
  fetchAreas()
}

const resetFilters = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchAreas()
}

/* =============================
   PROVIDE/INJECT
============================== */
const registerAddModal = inject('registerAddModal')
const unregisterAddModal = inject('unregisterAddModal')

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchAreas())

onMounted(() => {
  fetchAreas()
  registerAddModal?.(() => {
    showAddModal.value = true
  })
})

onBeforeUnmount(() => {
  unregisterAddModal?.()
})
</script>