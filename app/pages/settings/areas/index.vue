<template>
  <div>
    <Teleport to="#search-teleport-target">
      <!-- <div class="flex-start gap-sm w-100 flex-wrap"> -->
        <SearchBar
          :placeholder="t('pages.search')"
          :filters="searchFilters"
          @filter="handleFilter"
          @reset="resetFilters"
        />
      <!-- </div> -->
    </Teleport>

    <TablesAppTable
      :headers="headers"
      :current-page="currentPage"
      :total-pages="totalPages"
      :loading="loading"
      @update:current-page="handlePageChange"
    >
      <template #body="{ getIndex }">
        <tr v-if="!loading && areas.length === 0">
          <td :colspan="headers.length" class="text-center danger">
            {{ t('errors.somethingWentWrong') }}
          </td>
        </tr>

        <tr v-for="(area, index) in areas" :key="area.id">
          <th class="index-cell">{{ getIndex(index) }}</th>
          <td>{{ area.name?.[locale] || area.name?.ar }}</td>
          <td>{{ area.governorate?.name || '—' }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" :title="t('buttons.view')" @click="handleView(area.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" :title="t('buttons.edit')" @click="handleEdit(area)">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" :title="t('buttons.delete')" @click="handleDelete(area)">
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
    :title="t('buttons.view') + ' ' + t('settings.add_area')"
    :data="selectedArea"
    :fields="areaViewFields"
    :icon="IconsSettingsRegions"
  />

  <ModalsAppAddModal
    v-model="showAddModal"
    :title="t('settings.add') + ' ' + t('settings.add_area')"
    :icon="IconsSettingsRegions"
    :fields="areaFormFields"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    @submit="handleAddSubmit"
  />

  <ModalsAppEditModal
    v-model="showEditModal"
    :title="t('buttons.edit') + ' ' + t('settings.add_area')"
    :icon="IconsSettingsRegions"
    :fields="areaFormFields"
    :initial-data="selectedEditArea"
        data-bs-backdrop="static"
    data-bs-keyboard="false"
    @submit="handleEditSubmit"
  />

  <ModalsAppDeleteModal
    v-model="showDeleteModal"
    :title="t('buttons.delete') + ' ' + t('settings.add_area')"
    :itemType="t('settings.add_area')"
    :itemName="selectedDeleteArea?.name?.[locale] || selectedDeleteArea?.name?.ar"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { IconsSettingsRegions } from '#components'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const api = useApi()
const { viewItem, loading: viewLoading } = useView()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const governorateFilter = ref(null)   // ✅ filter المحافظة
const governorateOptions = ref([])    // ✅ options للـ select
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

const headers = computed(() => [
  { label: t('labels.id'), class: 'index-cell' },
  { label: t('labels.area'), class: '' },
  { label: t('labels.governorate'), class: '' },
  { label: t('labels.actions'), class: 'actions-cell' }
])

const areaViewFields = computed(() => [
  { label: t('labels.name_ar'), key: 'name.ar' },
  { label: t('labels.name_en'), key: 'name.en' },
  { label: t('labels.governorate'), key: 'governorate.name' },
])

// ✅ computed عشان الـ options تتحدث تلقائي
const areaFormFields = computed(() => [
  { key: 'name.ar', label: t('labels.name_ar'), placeholder: t('labels.name_ar') },
  { key: 'name.en', label: t('labels.name_en'), placeholder: t('labels.name_en') },
  {
    key: 'governorate_id',
    label: t('labels.governorate'),
    type: 'select',
    placeholder: t('pages.select'),
    options: governorateOptions.value
  },
])

// ✅ searchFilters للـ SearchBar
const searchFilters = computed(() => [
  {
    key: 'governorate_id',
    placeholder: t('labels.governorate'),
    options: governorateOptions.value
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

/* =============================
   FETCH GOVERNORATES للـ select
============================== */
const fetchGovernorates = async () => {
  try {
    const res = await api('/v1/admin/governorates?per_page=100')
    governorateOptions.value = (res.data || []).map(item => ({
      label: item.name?.[locale.value] || item.name?.ar,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching governorates:', err)
  }
}

/* =============================
   FETCH AREAS
============================== */
const fetchAreas = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: 'created_at',
      with: 'governorate',
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())
    if (governorateFilter.value) params.append('governorate_id', governorateFilter.value)

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
    await api('/v1/admin/areas', { method: 'POST', body: data })
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
    await api(`/v1/admin/areas/${selectedEditArea.value.id}`, { method: 'PUT', body: data })
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
    await api(`/v1/admin/areas/${selectedDeleteArea.value.id}`, { method: 'DELETE' })
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
const handleFilter = ({ search, governorate_id }) => {
  searchQuery.value = search
  governorateFilter.value = governorate_id || null
  currentPage.value = 1
  fetchAreas()
}

const resetFilters = () => {
  searchQuery.value = ''
  governorateFilter.value = null
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
  fetchGovernorates()   // ✅ جلب المحافظات للـ select
  registerAddModal?.(() => { showAddModal.value = true })
})

onBeforeUnmount(() => {
  unregisterAddModal?.()
})
</script>

