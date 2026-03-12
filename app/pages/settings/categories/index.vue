<template>
  <div>
    <Teleport to="#search-teleport-target">
      <div class="flex-start gap-sm w-100 flex-wrap">
        <SearchBar
          placeholder="بحث عن تصنيف .."
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
        <tr v-if="!loading && categories.length === 0">
          <td :colspan="headers.length" class="text-center">
            لا توجد تصنيفات للعرض
          </td>
        </tr>

        <tr v-for="category in categories" :key="category.id">
          <th class="index-cell">{{ category.id }}</th>
          <td>{{ category.name?.ar }}</td>
          <td>{{ category.code }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" title="عرض" @click="handleView(category.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" title="تعديل" @click="handleEdit(category)">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" title="حذف" @click="handleDelete(category)">
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
    title="عرض تصنيف"
    :data="selectedCategory"
    :fields="categoryViewFields"
    :icon="IconsCategories"
  />

  <ModalsAppAddModal
    v-model="showAddModal"
    title="إضافة تصنيف"
    :icon="IconsCategories"
    :fields="categoryFormFields"
    @submit="handleAddSubmit"
  />

  <ModalsAppEditModal
    v-model="showEditModal"
    title="تعديل تصنيف"
    :icon="IconsCategories"
    :fields="categoryFormFields"
    :initial-data="selectedEditCategory"
    @submit="handleEditSubmit"
  />

  <ModalsAppDeleteModal
    v-model="showDeleteModal"
    title="حذف التصنيف"
    itemType="تصنيف"
    :itemName="selectedDeleteCategory?.name?.ar"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { IconsCategories } from '#components'

const api = useApi()
const { viewItem, loading: viewLoading } = useView()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const categories = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)

const showViewModal = ref(false)
const selectedCategory = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEditCategory = ref(null)
const showDeleteModal = ref(false)
const selectedDeleteCategory = ref(null)

const headers = [
  { label: '#', class: 'index-cell' },
  { label: 'اسم التصنيف', class: '' },
  { label: 'الكود', class: '' },
  { label: 'الإجراءات', class: 'actions-cell' }
]

const categoryViewFields = [
  { label: 'اسم التصنيف باللغة العربية', key: 'name.ar' },
  { label: 'اسم التصنيف باللغة الإنجليزية', key: 'name.en' },
  { label: 'الكود', key: 'code' },
]

const categoryFormFields = [
  { key: 'name.ar', label: 'اسم التصنيف باللغة العربية', placeholder: 'ادخل الاسم باللغة العربية' },
  { key: 'name.en', label: 'اسم التصنيف باللغة الإنجليزية', placeholder: 'ادخل الاسم باللغة الإنجليزية' },
  { key: 'code', label: 'كود التصنيف', placeholder: 'ادخل الكود', type: 'number' },
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
const fetchCategories = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: 'created_at',
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())

    const res = await api(`/v1/admin/categories?${params}`)
    categories.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
  } catch (err) {
    console.error('Error fetching categories:', err)
    categories.value = []
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
    const data = await viewItem('categories', id)
    selectedCategory.value = data
    showViewModal.value = true
  } catch (err) {
    console.error('Error viewing category:', err)
  }
}

const handleAddSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api('/v1/admin/categories', {
      method: 'POST',
      body: {
        ...data,
        code: Number(data.code)   // ✅ API بتتوقع number
      }
    })
    close()
    fetchCategories()
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

const handleEdit = (category) => {
  selectedEditCategory.value = category
  showEditModal.value = true
}

const handleEditSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/categories/${selectedEditCategory.value.id}`, {
      method: 'PUT',
      body: {
        ...data,
        code: Number(data.code),             // ✅ number
        category_id: selectedEditCategory.value.id  // ✅ required في الـ PUT
      }
    })
    close()
    fetchCategories()
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

const handleDelete = (category) => {
  selectedDeleteCategory.value = category
  showDeleteModal.value = true
}

const handleDeleteConfirm = async ({ setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/categories/${selectedDeleteCategory.value.id}`, {
      method: 'DELETE'
    })
    close()
    fetchCategories()
  } catch (err) {
    console.error('Error deleting category:', err)
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
  fetchCategories()
}

const resetFilters = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchCategories()
}

/* =============================
   PROVIDE/INJECT
============================== */
const registerAddModal = inject('registerAddModal')
const unregisterAddModal = inject('unregisterAddModal')

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchCategories())

onMounted(() => {
  fetchCategories()
  registerAddModal?.(() => { showAddModal.value = true })
})

onBeforeUnmount(() => {
  unregisterAddModal?.()
})
</script>