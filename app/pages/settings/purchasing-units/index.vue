<template>
  <div>
    <Teleport to="#search-teleport-target">
        <SearchBar
          :placeholder="t('common.search')"
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
      <template #body="{ getIndex }">
        <tr v-if="!loading && purchasingUnits.length === 0">
          <td :colspan="headers.length" class="text-center danger">
            {{ t('common.no_results_found') }}
          </td>
        </tr>

        <tr v-for="(unit, index) in purchasingUnits" :key="unit.id">
          <th class="index-cell">{{ getIndex(index) }}</th>
          <td>{{ unit.name?.[locale] || unit.name?.ar }}</td>
          <td>{{ unit.code }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" :title="t('common.view')" @click="handleView(unit.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" :title="t('common.edit')" @click="handleEdit(unit)">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" :title="t('common.delete')" @click="handleDelete(unit)">
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
    :title="t('common.view') + ' ' + t('settings.add_purchasing_unit')"
    :data="selectedUnit"
    :fields="unitViewFields"
    :icon="IconsUnits"
  />

  <ModalsAppAddModal
    v-model="showAddModal"
    :title="t('common.add') + ' ' + t('settings.add_purchasing_unit')"
    :icon="IconsUnits"
    :fields="unitFormFields"    
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    @submit="handleAddSubmit"
  />

  <ModalsAppEditModal
    v-model="showEditModal"
    :title="t('common.edit') + ' ' + t('settings.add_purchasing_unit')"
    :icon="IconsUnits"
    :fields="unitFormFields"
    :initial-data="selectedEditUnit"
        data-bs-backdrop="static"
    data-bs-keyboard="false"
    @submit="handleEditSubmit"
  />

  <ModalsAppDeleteModal
    v-model="showDeleteModal"
    :title="t('common.delete') + ' ' + t('settings.add_purchasing_unit')"
    :itemType="t('settings.add_purchasing_unit')"
    :itemName="selectedDeleteUnit?.name?.[locale] || selectedDeleteUnit?.name?.ar"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { IconsUnits } from '#components'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
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

const headers = computed(() => [
  { label: t('common.id'), class: 'index-cell' },
  { label: t('settings.add_purchasing_unit'), class: '' },
  { label: t('labels.code'), class: '' },
  { label: t('common.actions'), class: 'actions-cell' }
])

const unitViewFields = computed(() => [
  { label: t('labels.name_ar'), key: 'name.ar' },
  { label: t('labels.name_en'), key: 'name.en' },
  { label: t('labels.code'), key: 'code' },
])

const unitFormFields = computed(() => [
  { key: 'name.ar', label: t('labels.name_ar'), placeholder: t('placeholders.name_ar') },
  { key: 'name.en', label: t('labels.name_en'), placeholder: t('placeholders.name_en') },
  { key: 'code', label: t('labels.code'), placeholder: t('placeholders.code'), type: 'text' },
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