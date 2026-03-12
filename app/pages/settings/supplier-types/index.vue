<template>
  <div>
    <Teleport to="#search-teleport-target">
      <div class="flex-start gap-sm w-100 flex-wrap">
        <SearchBar
          placeholder="بحث عن نوع مورد .."
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
        <tr v-if="!loading && supplierTypes.length === 0">
          <td :colspan="headers.length" class="text-center">
            لا توجد أنواع موردين للعرض
          </td>
        </tr>

        <tr v-for="type in supplierTypes" :key="type.id">
          <th class="index-cell">{{ type.id }}</th>
          <td>{{ type.LocalizedName }}</td>

          <td class="actions-cell">
            <div>
              <button class="action-btn view" title="عرض" @click="handleView(type.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" title="تعديل" @click="handleEdit(type)" :disabled="type.is_static">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" title="حذف" @click="handleDelete(type)" :disabled="type.is_static">
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
    title="عرض نوع مورد"
    :data="selectedType"
    :fields="typeViewFields"
    :icon="IconsSuppliers"
  />

  <ModalsAppAddModal
    v-model="showAddModal"
    title="إضافة نوع مورد"
    :icon="IconsSuppliers"
    :fields="typeFormFields"
    @submit="handleAddSubmit"
  />

  <ModalsAppEditModal
    v-model="showEditModal"
    title="تعديل نوع مورد"
    :icon="IconsSuppliers"
    :fields="typeFormFields"
    :initial-data="selectedEditType"
    @submit="handleEditSubmit"
  />

  <ModalsAppDeleteModal
    v-model="showDeleteModal"
    title="حذف نوع المورد"
    itemType="نوع مورد"
    :itemName="selectedDeleteType?.name?.ar"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { IconsSuppliers } from '#components'

const api = useApi()
const { viewItem, loading: viewLoading } = useView()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const supplierTypes = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)

const showViewModal = ref(false)
const selectedType = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEditType = ref(null)
const showDeleteModal = ref(false)
const selectedDeleteType = ref(null)

const headers = [
  { label: '#', class: 'index-cell' },
  { label: 'اسم الدور', class: '' },
  { label: 'الإجراءات', class: 'actions-cell' }
]

const typeViewFields = [
  { label: 'اسم المورد باللغة العربية', key: 'name.ar' },
  { label: 'اسم المورد باللغة الإنجليزية', key: 'name.en' },
]

const typeFormFields = [
  { key: 'name.ar', label: 'اسم المورد باللغة العربية', placeholder: 'ادخل الاسم باللغة العربية' },
  { key: 'name.en', label: 'اسم المورد باللغة الإنجليزية', placeholder: 'ادخل الاسم باللغة الإنجليزية' },
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
const fetchSupplierTypes = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: 'created_at',
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())

    const res = await api(`/v1/admin/supplier-types?${params}`)
    supplierTypes.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
  } catch (err) {
    console.error('Error fetching supplier types:', err)
    supplierTypes.value = []
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
    const data = await viewItem('supplier-types', id)
    selectedType.value = data
    showViewModal.value = true
  } catch (err) {
    console.error('Error viewing supplier type:', err)
  }
}

const handleAddSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api('/v1/admin/supplier-types', {
      method: 'POST',
      body: data
    })
    close()
    fetchSupplierTypes()
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

const handleEdit = (type) => {
  selectedEditType.value = type
  showEditModal.value = true
}

const handleEditSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/supplier-types/${selectedEditType.value.id}`, {
      method: 'PUT',
      body: data
    })
    close()
    fetchSupplierTypes()
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

const handleDelete = (type) => {
  selectedDeleteType.value = type
  showDeleteModal.value = true
}

const handleDeleteConfirm = async ({ setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/supplier-types/${selectedDeleteType.value.id}`, {
      method: 'DELETE'
    })
    close()
    fetchSupplierTypes()
  } catch (err) {
    console.error('Error deleting supplier type:', err)
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
  fetchSupplierTypes()
}

const resetFilters = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchSupplierTypes()
}

/* =============================
   PROVIDE/INJECT
============================== */
const registerAddModal = inject('registerAddModal')
const unregisterAddModal = inject('unregisterAddModal')

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchSupplierTypes())

onMounted(() => {
  fetchSupplierTypes()
  registerAddModal?.(() => { showAddModal.value = true })
})

onBeforeUnmount(() => {
  unregisterAddModal?.()
})
</script>

<style scoped>
.badge-static {
  background-color: color-mix(in srgb, var(--warning-color, #f59e0b) 15%, transparent);
  color: var(--warning-color, #f59e0b);
  padding: 3px 10px;
  border-radius: 20px;
  font-size: var(--size-xs);
}

.badge-dynamic {
  background-color: color-mix(in srgb, var(--primary-color) 15%, transparent);
  color: var(--primary-color);
  padding: 3px 10px;
  border-radius: 20px;
  font-size: var(--size-xs);
}

/* تعطيل الـ buttons للـ static items */
.action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>