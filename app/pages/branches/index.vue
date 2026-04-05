<template>
  <PageLayout
    :hasAside="false"
    :formTitle="t('settings.record') + ' ' + t('menu.branches')"
  >
    <template #search>
     <ClientOnly>
      <SearchBar
        :placeholder="t('placeholders.search')"
        :filters="searchFilters"
        :loading="loading"
        @filter="handleFilter"
        @reset="resetFilters"
      />  
    </ClientOnly>
    </template>

    <template #header-actions>
      <button
        class="custom-btn primary-btn fltr_btn"
        @click="showAddModal = true"
      >
        <span style="font-size: 20px">+</span>
        <span class="ms-1">{{ t('common.add') }} {{ t('settings.add_branch') }}</span>
      </button>
    </template>

    <template #main>
      <TablesAppTable
        :headers="headers"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="perPage"
        :loading="loading"
        @update:current-page="handlePageChange"
      >
        <template #body="{ getIndex }">
          <tr v-if="!loading && branches.length === 0">
            <td :colspan="headers.length" class="text-center danger">
              {{ t('common.no_results_found') }}
            </td>
          </tr>

          <tr v-for="(branch, index) in branches" :key="branch.id">
            <th class="index-cell">{{ getIndex(index) }}</th>
            <td>{{ branch.name?.[locale] || branch.name?.ar || branch.LocalizedName || '—' }}</td>
            <td>{{ branch.email || '—' }}</td>
            <td>{{ branch.governorate?.name?.[locale] || branch.governorate?.name?.ar || branch.governorate?.name || '—' }}</td>
            <td>{{ branch.phone || '—' }}</td>
            <td class="actions-cell">
              <div>
                <button class="action-btn view" :title="t('common.view')" @click="handleView(branch.id)" :disabled="viewLoading">
                  <IconsEye width="18" height="18" />
                </button>
                <button class="action-btn edit" :title="t('common.edit')" @click="handleEdit(branch)">
                  <IconsEdit width="18" height="18" />
                </button>
                <button class="action-btn delete" :title="t('common.delete')" @click="handleDelete(branch)">
                  <IconsDelete width="18" height="18" />
                </button>
              </div>
            </td>
          </tr>
        </template>
      </TablesAppTable>
    </template>
  </PageLayout>

  <ClientOnly>
    <ModalsAppViewModal
      v-model="showViewModal"
      :title="t('common.view') + ' ' + t('settings.add_branch')"
      :data="selectedBranch"
      :fields="branchViewFields"
      :icon="IconsBranches"
    />

    <ModalsAppAddModal
      ref="addModal"
      v-model="showAddModal"
      :title="t('settings.add') + ' ' + t('settings.add_branch')"
      :icon="IconsBranches"
      :fields="branchFormFields"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      @submit="handleAddSubmit"
      @change="handleModalChange"
    />

    <ModalsAppEditModal
      ref="editModal"
      v-model="showEditModal"
      :title="t('common.edit') + ' ' + t('settings.add_branch')"
      :icon="IconsBranches"
      :fields="branchFormFields"
      :initial-data="selectedEditBranch"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      @submit="handleEditSubmit"
      @change="handleModalChange"
    />

    <ModalsAppDeleteModal
      v-model="showDeleteModal"
      :title="t('common.delete') + ' ' + t('settings.add_branch')"
      :itemType="t('settings.add_branch')"
      :itemName="selectedDeleteBranch?.name?.[locale] || selectedDeleteBranch?.name?.ar"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      @confirm="handleDeleteConfirm"
    />
  </ClientOnly>
</template>

<script setup>
definePageMeta({ middleware: 'auth', adminOnly: true })
usePageMeta('menu.branches')

import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { useAppToast } from '~/composables/useAppToast'
import { IconsBranches } from '#components'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'

import { useSearchFilter } from '~/composables/useSearchFilter'

const { t, locale } = useI18n()
const api = useApi()
const { viewItem, loading: viewLoading } = useView()
const { success, error: toastError } = useAppToast()

/* =============================
   STATE
============================== */
const governorateFilter = ref(null)
const branches = ref([])
const governorateOptions = ref([])
const areaOptions = ref([]) // if still used elsewhere
const governoratesWithAreas = ref([])
const perPage = 15

const {
  loading,
  searchQuery,
  currentPage,
  totalPages,
  handleFilter: baseFilter,
  handleReset: baseReset
} = useSearchFilter(() => fetchBranches())

const showViewModal = ref(false)
const selectedBranch = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEditBranch = ref(null)
const showDeleteModal = ref(false)
const selectedDeleteBranch = ref(null)
const selectedGovernorateInModal = ref(null)
const addModal = ref(null)
const editModal = ref(null)

/* =============================
   COMPUTED
============================== */
const headers = computed(() => [
  { label: '#', class: 'index-cell' },
  { label: t('labels.branches'), class: '' },
  { label: t('labels.email'), class: '' },
  { label: t('labels.governorate'), class: '' },
  { label: t('labels.phone'), class: '' },
  { label: t('common.actions'), class: 'actions-cell' }
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
  { 
    key: 'name.ar', 
    label: t('labels.name_ar'), 
    placeholder: t('placeholders.name_ar'),
    rules: yup.string()
      .required(t('errors.isRequired', { name: t('labels.name_ar') }))
      .test('no-english', t('validation.arabic_only'), value => !/[a-zA-Z]/.test(value || ''))
      .min(2, t('errors.min', { name: t('labels.name_ar'), num: 2 }))
  },
  { 
    key: 'name.en', 
    label: t('labels.name_en'), 
    placeholder: t('placeholders.name_en'),
    rules: yup.string()
      .required(t('errors.isRequired', { name: t('labels.name_en') }))
      .test('no-arabic', t('validation.english_only'), value => !/[ء-ي]/.test(value || ''))
      .min(2, t('errors.min', { name: t('labels.name_en'), num: 2 }))
  },
  { 
    key: 'email', 
    label: t('labels.email'), 
    placeholder: 'example@email.com', 
    type: 'email',
    rules: yup.string()
      .required(t('errors.isRequired', { name: t('labels.email') }))
      .email(t('validation.email_invalid'))
  },
  { 
    key: 'phone', 
    label: t('labels.phone'), 
    placeholder: '96512345678', 
    type: 'text',
    rules: yup.string()
      .required(t('errors.isRequired', { name: t('labels.phone') }))
      .matches(/^[0-9]+$/, t('validation.no_text'))
      .min(8, t('errors.min', { name: t('labels.phone'), num: 8 }))
      .max(15, t('errors.max', { name: t('labels.phone'), num: 15 }))
  },
  { 
    key: 'address', 
    label: t('labels.address'), 
    placeholder: t('labels.address'),
    rules: yup.string().required(t('errors.isRequired', { name: t('labels.address') }))
  },
  {
    key: 'governorate_id',
    label: t('labels.governorate'),
    type: 'select',
    placeholder: t('placeholders.select'),
    options: governorateOptions.value,
    rules: yup.mixed().required(t('errors.isRequired', { name: t('labels.governorate') }))
  },
  {
    key: 'area_id',
    label: t('labels.area'),
    type: 'select',
    placeholder: t('placeholders.select'),
    options: (governoratesWithAreas.value.find(g => g.id === selectedGovernorateInModal.value)?.areas || []).map(area => ({
        label: area.name?.[locale.value] || area.name?.ar || area.LocalizedName,
        value: area.id
    })),
    rules: yup.mixed().required(t('errors.isRequired', { name: t('labels.area') }))
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
    governoratesWithAreas.value = (res.data || [])
    governorateOptions.value = governoratesWithAreas.value.map(item => ({
      label: item.name?.[locale.value] || item.name?.ar,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching governorates:', err)
    governorateOptions.value = []
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
    success(t('messages.added_successfully', { item: t('settings.add_branch') }))
    close()
    fetchBranches()
  } catch (err) {
    if (err?.data?.errors) {
      const apiErrors = {}
      Object.entries(err.data.errors).forEach(([key, messages]) => {
        apiErrors[key] = messages[0]
      })
      setErrors(apiErrors)
    } else {
      toastError(err?.data?.message || t('common.somethingWentWrong'))
    }
  } finally {
    setLoading(false)
  }
}

const handleEdit = (branch) => {
  const data = { ...branch }
  // ✅ Map IDs from nested objects for selects
  if (!data.governorate_id && data.governorate?.id) data.governorate_id = data.governorate.id
  if (!data.area_id && data.area?.id) data.area_id = data.area.id
  
  selectedEditBranch.value = data
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
    success(t('messages.updated_successfully', { item: t('settings.add_branch') }))
    close()
    fetchBranches()
  } catch (err) {
    if (err?.data?.errors) {
      const apiErrors = {}
      Object.entries(err.data.errors).forEach(([key, messages]) => {
        apiErrors[key] = messages[0]
      })
      setErrors(apiErrors)
    } else {
      toastError(err?.data?.message || t('common.somethingWentWrong'))
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
    success(t('messages.deleted_successfully', { item: t('settings.add_branch') }))
    close()
    fetchBranches()
  } catch (err) {
    toastError(err?.data?.message || t('common.somethingWentWrong'))
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

const handleModalChange = ({ key, value }) => {
  if (key === 'governorate_id') {
    selectedGovernorateInModal.value = value
    // ✅ ريست المنطقة عشان ميطلعش إيرور "المنطقة لا تتبع المحافظة"
    if (addModal.value) addModal.value.setFieldValue('area_id', '')
    if (editModal.value) editModal.value.setFieldValue('area_id', '')
  }
}

watch([showAddModal, showEditModal], ([newAdd, newEdit]) => {
  if (!newAdd && !newEdit) {
    selectedGovernorateInModal.value = null
  }
})

// ✅ عند تعديل فرع، خزن المحافظة عشان الـ dropdown بتاعة المناطق تتملي صح
watch(selectedEditBranch, (newVal) => {
  if (newVal?.governorate_id) {
    selectedGovernorateInModal.value = newVal.governorate_id
  }
})

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchBranches())

onMounted(() => {
  fetchBranches().catch(console.error)
  fetchGovernorates().catch(console.error)
})
</script>