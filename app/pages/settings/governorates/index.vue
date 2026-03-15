<template>
  <div>
    <Teleport to="#search-teleport-target">
      <SearchBar
        :placeholder="t('pages.search')"
        :loading="loading"
        @filter="handleFilter"
        @reset="resetFilters"
      />
    </Teleport>

    <TablesAppTable 
      :headers="headers"
      :current-page="currentPage"
      :total-pages="totalPages"
      :per-page="perPage"
      :loading="loading"
      @update:current-page="handlePageChange"
    >
      <template #body="{ getIndex }">
        <tr v-if="!loading && governorates.length === 0">
          <td :colspan="headers.length" class="text-center danger">
            {{ t('errors.somethingWentWrong') }}
          </td>
        </tr>

        <tr v-for="(gov, i) in governorates" :key="gov.id">
          <th class="index-cell">{{ getIndex(i) }}</th>
          <td>{{ gov.name?.[locale] || gov.name?.ar }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" :title="t('buttons.view')" @click="handleView(gov.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" :title="t('buttons.edit')" @click="handleEdit(gov)">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" :title="t('buttons.delete')" @click="handleDelete(gov)">
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
    title="عرض محافظة"
    :data="selectedGovernorate"
    :fields="governorateFields"
    :icon="IconsGovernorates"
  />

  <!-- Add Modal -->
  <ModalsAppAddModal
    v-model="showAddModal"
    title="إضافة محافظة"
    :icon="IconsGovernorates"
    :fields="governorateAddFields"    
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    @submit="handleAddSubmit"
  />

  <!-- Edit Modal -->
<ModalsAppEditModal
  v-model="showEditModal"
  title="تعديل محافظة"
  :icon="IconsGovernorates"
  :fields="governorateAddFields"
  :initial-data="selectedEditGovernorate"
      data-bs-backdrop="static"
    data-bs-keyboard="false"
  @submit="handleEditSubmit"
/>

<!-- Delete Modal -->
<ModalsAppDeleteModal
  v-model="showDeleteModal"
  :title="t('settings.delete_governorate')"
  :itemType="t('settings.governorate')"
  :itemName="selectedDeleteGovernorate?.name?.ar"
      data-bs-backdrop="static"
    data-bs-keyboard="false"
  @confirm="handleDeleteConfirm"
/>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { IconsGovernorates } from '#components' 

const api = useApi()
const { viewItem, loading: viewLoading } = useView()
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n() 

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const governorates = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)

// Data Modals
const showViewModal = ref(false)
const selectedGovernorate = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEditGovernorate = ref(null)
const showDeleteModal = ref(false)
const selectedDeleteGovernorate = ref(null)

const headers = computed(() => [
  { label: t('labels.id'), class: 'index-cell' },
  { label: t('labels.governorate'), class: '' },
  { label: t('labels.actions'), class: 'actions-cell' }
])

const governorateFields = computed(() => [
  { label: t('labels.name_ar'), key: 'name.ar' },
  { label: t('labels.name_en'), key: 'name.en' },
])

const governorateAddFields = computed(() => [
  { key: 'name.ar', label: t('labels.name_ar'), placeholder: t('placeholders.name_ar') },
  { key: 'name.en', label: t('labels.name_en'), placeholder: t('placeholders.name_en') },
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

/* =============================
   FETCH DATA
============================== */
const fetchGovernorates = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      ...(searchQuery.value && { search: searchQuery.value })
    })
    const res = await api(`/v1/admin/governorates?${params}`)
    governorates.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
  } catch (err) {
    console.error('Error fetching governorates:', err)
    governorates.value = []
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
    const data = await viewItem('governorates', id)
    selectedGovernorate.value = data
    showViewModal.value = true
  } catch (err) {
    console.error('Error viewing governorate:', err)
  }
}

const handleAddSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api('/v1/admin/governorates', {
      method: 'POST',
      body: data
    })
    close()
    fetchGovernorates()
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

// فتح الـ Edit Modal وتعبئته بالبيانات
const handleEdit = (gov) => {
  selectedEditGovernorate.value = gov   // ✅ بيبعت البيانات الحالية للـ modal
  showEditModal.value = true
}
// Submit التعديل
const handleEditSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/governorates/${selectedEditGovernorate.value.id}`, {
      method: 'PUT',
      body: data
    })
    close()
    fetchGovernorates()
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

const handleDelete = (gov) => {
  console.log('gov:', gov)  // تأكد إن فيه id
  selectedDeleteGovernorate.value = gov
  showDeleteModal.value = true
}

const handleDeleteConfirm = async ({ setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/governorates/${selectedDeleteGovernorate.value.id}`, {
      method: 'DELETE'
    })
    close()             // ✅ هنا بعد نجاح الـ request
    fetchGovernorates() // ✅ refresh الـ table
  } catch (err) {
    console.error('Error deleting governorate:', err)
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
  fetchGovernorates()
}

const resetFilters = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchGovernorates()
}
/* =============================
   PROVIDE/INJECT للـ Add Button
============================== */
const registerAddModal = inject('registerAddModal')      // ✅ الاسم الصح
const unregisterAddModal = inject('unregisterAddModal')  // ✅ الاسم الصح

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchGovernorates())

onMounted(() => {
  fetchGovernorates()
  registerAddModal?.(() => {        // ✅ register
    showAddModal.value = true
  })
})

onBeforeUnmount(() => {             // ✅ before مش after
  unregisterAddModal?.()            // ✅ unregister
})
</script>
