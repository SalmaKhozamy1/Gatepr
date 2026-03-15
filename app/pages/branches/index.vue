<template>
  <PageLayout
    :hasAside="false"
    :formTitle="t('settings.record') + ' ' + t('menu.branches')"
  >
    <template #search>
      <SearchBar
        :placeholder="t('pages.search')"
        :filters="searchFilters"
        :loading="loading"
        @filter="handleFilter"
        @reset="resetFilters"
      />
    </template>

    <template #header-actions>
      <button
        class="custom-btn primary-btn min-btn-width fltr_btn py-2"
        @click="showAddModal = true"
      >
        <span style="font-size: 20px">+</span>
        <span class="ms-1">{{ t('settings.add') }} {{ t('settings.add_branch') }}</span>
      </button>
    </template>

    <template #main>
      <TablesAppTable
        :headers="headers"
        :current-page="currentPage"
        :total-pages="totalPages"
        :loading="loading"
        @update:current-page="handlePageChange"
      >
        <template #body="{ getIndex }">
          <tr v-if="!loading && branches.length === 0">
            <td :colspan="headers.length" class="text-center danger">
              {{ t('errors.somethingWentWrong') }}
            </td>
          </tr>

          <tr v-for="(branch, index) in branches" :key="branch.id">
            <th class="index-cell">{{ getIndex(index) }}</th>
            <td>{{ branch.name?.[locale] || branch.name?.ar }}</td>
            <td>{{ branch.email || '—' }}</td>
            <td>{{ branch.governorate?.name?.[locale] || branch.governorate?.name?.ar || '—' }}</td>
            <td>{{ branch.phone || '—' }}</td>
            <td class="actions-cell">
              <div>
                <button class="action-btn view" :title="t('buttons.view')" @click="handleView(branch.id)" :disabled="viewLoading">
                  <IconsEye width="18" height="18" />
                </button>
                <button class="action-btn edit" :title="t('buttons.edit')" @click="handleEdit(branch)">
                  <IconsEdit width="18" height="18" />
                </button>
                <button class="action-btn delete" :title="t('buttons.delete')" @click="handleDelete(branch)">
                  <IconsDelete width="18" height="18" />
                </button>
              </div>
            </td>
          </tr>
        </template>
      </TablesAppTable>
    </template>
  </PageLayout>

  <ModalsAppViewModal
    v-model="showViewModal"
    :title="t('buttons.view') + ' ' + t('settings.add_branch')"
    :data="selectedBranch"
    :fields="branchViewFields"
    :icon="IconsBranches"
  />

  <ModalsAppAddModal
    v-model="showAddModal"
    :title="t('settings.add') + ' ' + t('settings.add_branch')"
    :icon="IconsBranches"
    :fields="branchFormFields"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    @submit="handleAddSubmit"
  />

  <ModalsAppEditModal
    v-model="showEditModal"
    :title="t('buttons.edit') + ' ' + t('settings.add_branch')"
    :icon="IconsBranches"
    :fields="branchFormFields"
    :initial-data="selectedEditBranch"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    @submit="handleEditSubmit"
  />

  <ModalsAppDeleteModal
    v-model="showDeleteModal"
    :title="t('buttons.delete') + ' ' + t('settings.add_branch')"
    :itemType="t('settings.add_branch')"
    :itemName="selectedDeleteBranch?.name?.[locale] || selectedDeleteBranch?.name?.ar"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { IconsBranches } from '#components'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const api = useApi()
const { viewItem, loading: viewLoading } = useView()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const governorateFilter = ref(null)
const branches = ref([])
const governorateOptions = ref([])
const areaOptions = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)

const showViewModal = ref(false)
const selectedBranch = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEditBranch = ref(null)
const showDeleteModal = ref(false)
const selectedDeleteBranch = ref(null)

/* =============================
   COMPUTED
============================== */
const headers = computed(() => [
  { label: t('labels.id'), class: 'index-cell' },
  { label: t('labels.branches'), class: '' },
  { label: t('labels.email'), class: '' },
  { label: t('labels.governorate'), class: '' },
  { label: t('labels.phone'), class: '' },
  { label: t('labels.actions'), class: 'actions-cell' }
])

const branchViewFields = computed(() => [
  { label: t('labels.name_ar'), key: 'name.ar' },
  { label: t('labels.name_en'), key: 'name.en' },
  { label: t('labels.email'), key: 'email' },
  { label: t('labels.phone'), key: 'phone' },
  { label: t('labels.address'), key: 'address' },
  { label: t('labels.governorate'), key: 'governorate.name' },
  { label: t('labels.area'), key: 'area.name' },
])

const branchFormFields = computed(() => [
  { key: 'name.ar', label: t('labels.name_ar'), placeholder: t('placeholders.name_ar') },
  { key: 'name.en', label: t('labels.name_en'), placeholder: t('placeholders.name_en') },
  { key: 'email', label: t('labels.email'), placeholder: 'example@email.com', type: 'email' },
  { key: 'phone', label: t('labels.phone'), placeholder: '96512345678', type: 'text' },
  { key: 'address', label: t('labels.address'), placeholder: t('labels.address') },
  {
    key: 'governorate_id',
    label: t('labels.governorate'),
    type: 'select',
    placeholder: t('placeholders.select'),
    options: governorateOptions.value
  },
  {
    key: 'area_id',
    label: t('labels.area'),
    type: 'select',
    placeholder: t('placeholders.select'),
    options: areaOptions.value
  },
])

// ✅ searchFilters للـ SearchBar
const searchFilters = computed(() => [
  {
    key: 'governorate_id',
    placeholder: t('placeholders.all_governorates'),
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
   FETCH GOVERNORATES
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
    governorateOptions.value = []
  }
}

/* =============================
   FETCH AREAS
============================== */
const fetchAreas = async () => {
  try {
    const res = await api('/v1/admin/areas?per_page=100')
    areaOptions.value = (res.data || []).map(item => ({
      label: item.name?.[locale.value] || item.name?.ar,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching areas:', err)
    areaOptions.value = []
  }
}

/* =============================
   FETCH BRANCHES
============================== */
const fetchBranches = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: 'created_at',
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())
    if (governorateFilter.value) params.append('governorate_id', governorateFilter.value)
    params.append('with', 'governorate,area')

    const res = await api(`/v1/admin/branches?${params}`)
    branches.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
  } catch (err) {
    console.error('Error fetching branches:', err)
    branches.value = []
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
    const data = await viewItem('branches', id)
    selectedBranch.value = data
    showViewModal.value = true
  } catch (err) {
    console.error('Error viewing branch:', err)
  }
}

const handleAddSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api('/v1/admin/branches', {
      method: 'POST',
      body: data
    })
    close()
    fetchBranches()
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

const handleEdit = (branch) => {
  selectedEditBranch.value = branch
  showEditModal.value = true
}

const handleEditSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/branches/${selectedEditBranch.value.id}`, {
      method: 'PUT',
      body: {
        ...data,
        branch_id: selectedEditBranch.value.id
      }
    })
    close()
    fetchBranches()
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

const handleDelete = (branch) => {
  selectedDeleteBranch.value = branch
  showDeleteModal.value = true
}

const handleDeleteConfirm = async ({ setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/branches/${selectedDeleteBranch.value.id}`, {
      method: 'DELETE'
    })
    close()
    fetchBranches()
  } catch (err) {
    console.error('Error deleting branch:', err)
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
const handleFilter = ({ search, governorate_id } = {}) => {
  searchQuery.value = search ?? ''
  governorateFilter.value = governorate_id || null
  currentPage.value = 1
  fetchBranches()
}

const resetFilters = () => {
  searchQuery.value = ''
  governorateFilter.value = null
  currentPage.value = 1
  fetchBranches()
}

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchBranches())

onMounted(() => {
  fetchBranches().catch(console.error)
  fetchGovernorates().catch(console.error)
  fetchAreas().catch(console.error)
})
</script>