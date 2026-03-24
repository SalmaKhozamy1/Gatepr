<template>
  <div>
    <Teleport to="#search-teleport-target">
        <SearchBar
          :placeholder="t('common.search')"
          :filters="searchFilters"
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
        <tr v-if="!loading && receiptTypes.length === 0">
          <td :colspan="headers.length" class="text-center danger">
            {{ t('common.no_results_found') }}
          </td>
        </tr>

        <tr v-for="(type, index) in receiptTypes" :key="type.id">
          <th class="index-cell">{{ getIndex(index) }}</th>
          <td>{{ type.name?.[locale] || type.name?.ar }}</td>
          <td>
            <div class="toggle-switch-input">
              <InputsToggleSwitch
                :modelValue="type.is_active"
                :disabled="togglingId === type.id"
                @update:modelValue="handleToggleActive(type)"
              />
            </div>
          </td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" :title="t('common.view')" @click="handleView(type.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" :title="t('common.edit')" @click="handleEdit(type)">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" :title="t('common.delete')" @click="handleDelete(type)">
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
    :title="t('common.view') + ' ' + t('settings.add_receive_type')"
    :data="selectedType"
    :fields="typeViewFields"
    :icon="IconsReceiveType"
  />

  <ModalsAppAddModal
    v-model="showAddModal"
    :title="t('common.add') + ' ' + t('settings.add_receive_type')"
    :icon="IconsReceiveType"
    :fields="typeFormFields"    
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    @submit="handleAddSubmit"
  />

  <ModalsAppEditModal
    v-model="showEditModal"
    :title="t('common.edit') + ' ' + t('settings.add_receive_type')"
    :icon="IconsReceiveType"
    :fields="typeFormFields"
    :initial-data="selectedEditType"
        data-bs-backdrop="static"
    data-bs-keyboard="false"
    @submit="handleEditSubmit"
  />

  <ModalsAppDeleteModal
    v-model="showDeleteModal"
    :title="t('common.delete') + ' ' + t('settings.add_receive_type')"
    :itemType="t('settings.add_receive_type')"
    :itemName="selectedDeleteType?.name?.[locale] || selectedDeleteType?.name?.ar"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { IconsReceiveType } from '#components'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const api = useApi()
const { viewItem, loading: viewLoading } = useView()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const statusFilter = ref(null)
const receiptTypes = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)
const togglingId = ref(null)

const showViewModal = ref(false)
const selectedType = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEditType = ref(null)
const showDeleteModal = ref(false)
const selectedDeleteType = ref(null)

const headers = computed(() => [
  { label: t('common.id'), class: 'index-cell' },
  { label: t('settings.add_receive_type'), class: '' },
  { label: t('common.status'), class: '' },
  { label: t('common.actions'), class: 'actions-cell' }
])

const typeViewFields = computed(() => [
  { label: t('labels.name_ar'), key: 'name.ar' },
  { label: t('labels.name_en'), key: 'name.en' },
])

const typeFormFields = computed(() => [
  { key: 'name.ar', label: t('labels.name_ar'), placeholder: t('placeholders.name_ar') },
  { key: 'name.en', label: t('labels.name_en'), placeholder: t('placeholders.name_en') },
])

const searchFilters = computed(() => [
  {
    key: 'is_active',
    placeholder: t('labels.all_statuses'),
    options: [
      { label: t('common.active'), value: 1 },
      { label: t('common.inactive'), value: 0 },
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

/* =============================
   FETCH DATA
============================== */
const fetchReceiptTypes = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: 'created_at',
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())
    if (statusFilter.value !== null && statusFilter.value !== undefined) {
      params.append('is_active', statusFilter.value)
    }

    const res = await api(`/v1/admin/receipt-types?${params}`)
    receiptTypes.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
  } catch (err) {
    console.error('Error fetching receipt types:', err)
    receiptTypes.value = []
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
    const data = await viewItem('receipt-types', id)
    selectedType.value = data
    showViewModal.value = true
  } catch (err) {
    console.error('Error viewing receipt type:', err)
  }
}

const handleToggleActive = async (type) => {
  try {
    togglingId.value = type.id
    const res = await api(`/v1/admin/receipt-types/${type.id}/toggle-active`, {
      method: 'POST'
    })
    const updated = res.data
    const index = receiptTypes.value.findIndex(t => t.id === type.id)
    if (index !== -1) {
      receiptTypes.value[index] = { ...receiptTypes.value[index], is_active: updated.is_active }
    }
  } catch (err) {
    console.error('Error toggling active:', err)
  } finally {
    togglingId.value = null
  }
}

const handleAddSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api('/v1/admin/receipt-types', {
      method: 'POST',
      body: { ...data, is_active: true }
    })
    close()
    fetchReceiptTypes()
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
    await api(`/v1/admin/receipt-types/${selectedEditType.value.id}`, {
      method: 'PUT',
      body: data
    })
    close()
    fetchReceiptTypes()
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
    await api(`/v1/admin/receipt-types/${selectedDeleteType.value.id}`, {
      method: 'DELETE'
    })
    close()
    fetchReceiptTypes()
  } catch (err) {
    console.error('Error deleting receipt type:', err)
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
const handleFilter = ({ search, is_active } = {}) => {
  searchQuery.value = search ?? ''
  statusFilter.value = is_active ?? null
  currentPage.value = 1
  fetchReceiptTypes()
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = null
  currentPage.value = 1
  fetchReceiptTypes()
}

/* =============================
   PROVIDE/INJECT
============================== */
const registerAddModal = inject('registerAddModal')
const unregisterAddModal = inject('unregisterAddModal')

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchReceiptTypes())

onMounted(() => {
  fetchReceiptTypes()
  registerAddModal?.(() => { showAddModal.value = true })
})

onBeforeUnmount(() => {
  unregisterAddModal?.()
})
</script>