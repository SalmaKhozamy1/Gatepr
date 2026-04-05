<template>
  <div>
    <ClientOnly>
      <Teleport to="#search-teleport-target">
          <SearchBar
            :placeholder="t('placeholders.search')"
            :filters="searchFilters"
            :loading="loading"
            @filter="handleFilter"
            @reset="resetFilters"
          />
      </Teleport>
    </ClientOnly>

    <TablesAppTable
      :headers="headers"
      :current-page="currentPage"
      :total-pages="totalPages"
      :loading="loading"
      @update:current-page="handlePageChange"
    >
      <template #body="{ getIndex }">
        <tr v-if="!loading && users.length === 0">
          <td :colspan="headers.length" class="text-center danger">
            {{ t('common.no_results_found') }}
          </td>
        </tr>

        <tr v-for="(user, index) in users" :key="user.id">
          <th class="index-cell">{{ getIndex(index) }}</th>
          <td>{{ user.name?.[locale] || user.name?.ar }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>
            <ul class="branches-list" v-if="user.branches?.length">
              <li v-for="branch in user.branches" :key="branch.id">
                {{ branch.name?.[locale] || branch.name }}
              </li>
            </ul>
          </td>
          <td>{{ user.role?.name || user.roles?.[0]?.name || '—' }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" :title="t('common.view')" @click="handleView(user.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" :title="t('common.edit')" @click="handleEdit(user)">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" :title="t('common.delete')" @click="handleDelete(user)">
                <IconsDelete width="18" height="18" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>
  </div>

  <ClientOnly>
    <ModalsAppViewModal
      v-model="showViewModal"
      :title="t('common.view') + ' ' + t('labels.user')"
      :data="selectedUser"
      :fields="userViewFields"
      :icon="IconsSettingsUsers"
    />

    <ModalsAppAddModal
      v-model="showAddModal"
      :title="t('common.add') + ' ' + t('labels.user')"
      :icon="IconsSettingsUsers"
      :fields="userFormFields"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      @submit="handleAddSubmit"
    />

    <ModalsAppEditModal
      v-model="showEditModal"
      :title="t('common.edit') + ' ' + t('labels.user')"
      :icon="IconsSettingsUsers"
      :fields="userEditFields"
      :initial-data="selectedEditUser"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      @submit="handleEditSubmit"
    />

    <ModalsAppDeleteModal
      v-model="showDeleteModal"
      :title="t('common.delete') + ' ' + t('labels.user')"
      :itemType="t('labels.user')"
      :itemName="selectedDeleteUser?.name?.[locale] || selectedDeleteUser?.name?.ar"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      @confirm="handleDeleteConfirm"
    />
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { useAppToast } from '~/composables/useAppToast'
import { IconsSettingsUsers } from '#components'
import { useI18n } from 'vue-i18n'
import * as yup from 'yup'

const { t, locale } = useI18n()
const api = useApi()
const { viewItem, loading: viewLoading } = useView()
const { success, error: toastError } = useAppToast()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const branchFilter = ref(null)
const users = ref([])
const roleOptions = ref([])
const branchOptions = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(true)

const showViewModal = ref(false)
const selectedUser = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEditUser = ref(null)
const showDeleteModal = ref(false)
const selectedDeleteUser = ref(null)

const headers = computed(() => [
  { label: t('common.id'), class: 'index-cell' },
  { label: t('labels.name'), class: '' },
  { label: t('labels.email'), class: '' },
  { label: t('labels.phone'), class: '' },
  { label: t('labels.branches'), class: '' },
  { label: t('labels.role'), class: '' },
  { label: t('common.actions'), class: 'actions-cell' }
])

const userViewFields = computed(() => [
  { label: t('labels.name_ar'), key: 'name.ar' },
  { label: t('labels.name_en'), key: 'name.en' },
  { label: t('labels.email'), key: 'email' },
  { label: t('labels.phone'), key: 'phone' },
  { label: t('labels.role'), key: 'role.name' },
  { label: t('labels.branches'), key: 'branches' },
])

const userFormFields = computed(() => [
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
    type: 'tel',
    rules: yup.string()
      .required(t('errors.isRequired', { name: t('labels.phone') }))
      .matches(/^[0-9]+$/, t('validation.no_text'))
      .min(8, t('errors.min', { num: 8 }))
      .max(15, t('errors.max', { num: 15 }))
  },
  { 
    key: 'password', 
    label: t('labels.password'), 
    placeholder: t('placeholders.password'), 
    type: 'password',
    rules: yup.string()
      .required(t('errors.isRequired', { name: t('labels.password') }))
      .min(6, t('errors.min', { num: 6 }))
  },
  {
    key: 'role_id',
    label: t('labels.role'),
    type: 'select',
    placeholder: t('placeholders.role'),
    options: roleOptions.value,
    rules: yup.mixed().required(t('errors.isRequired', { name: t('labels.role') }))
  },
  {
    key: 'branch_ids',
    label: t('labels.branches'),
    type: 'multi-select',
    options: branchOptions.value,
    rules: yup.array().min(1, t('errors.isRequired', { name: t('labels.branches') }))
  },
])

const userEditFields = computed(() => [
  { 
    key: 'name.ar', 
    label: t('labels.name_ar'), 
    placeholder: t('placeholders.name_ar'),
    rules: yup.string()
      .required(t('errors.isRequired', { name: t('labels.name_ar') }))
      .min(2, t('errors.min', { name: t('labels.name_ar'), num: 2 }))
      .test('no-english', t('validation.arabic_only'), value => !/[a-zA-Z]/.test(value || ''))
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
    type: 'tel',
    rules: yup.string()
      .required(t('errors.isRequired', { name: t('labels.phone') }))
      .matches(/^[0-9]+$/, t('validation.no_text'))
      .min(8, t('errors.min', { num: 8 }))
      .max(15, t('errors.max', { num: 15 }))
  },
  { 
    key: 'password', 
    label: t('labels.password'), 
    placeholder: t('placeholders.password'), 
    type: 'password',
    rules: yup.string()
      .test('password-min', t('errors.min', { num: 6 }), value => !value || value.length >= 6)
      .nullable()
  },
  {
    key: 'role_id',
    label: t('labels.role'),
    type: 'select',
    placeholder: t('placeholders.role'),
    options: roleOptions.value,
    rules: yup.mixed().required(t('errors.isRequired', { name: t('labels.role') }))
  },
  {
    key: 'branch_ids',
    label: t('labels.branches'),
    type: 'multi-select',
    placeholder: t('placeholders.branch'),
    options: branchOptions.value,
    rules: yup.array().min(1, t('errors.isRequired', { name: t('labels.branches') }))
  },
])

const searchFilters = computed(() => [
  {
    key: 'branch_id',
    placeholder: t('placeholders.all_branches'),
    options: branchOptions.value  
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
   FETCH ROLES
============================== */
const fetchRoles = async () => {
  try {
    const res = await api('/v1/admin/roles?per_page=100')
    roleOptions.value = (res.data || []).map(item => ({
      label: item.name?.[locale.value] || item.name,
      value: item.id
    }))
    
  } catch (err) {
    console.error('Error fetching roles:', err)
    roleOptions.value = []
  }
}

/* =============================
   FETCH BRANCHES
============================== */
const fetchBranches = async () => {
  try {
    const res = await api('/v1/admin/branches?per_page=100')
    branchOptions.value = (res.data || []).map(item => ({
      label: item.name?.[locale.value] || item.name?.ar,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching branches - skipping:', err)
    branchOptions.value = []
  }
}

/* =============================
   FETCH USERS
============================== */
const fetchUsers = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: 'created_at',
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())
    if (branchFilter.value) params.append('branch_id', branchFilter.value)

    const res = await api(`/v1/admin/users?${params}`)
    users.value = res.data || []
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    if (currentPage.value > meta.lastPage) currentPage.value = 1
  } catch (err) {
    console.error('Error fetching users:', err)
    users.value = []
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
    const data = await viewItem('users', id)
    // ✅ Ensure role is accessible for the view modal (might be in 'roles' array)
    if (!data.role && data.roles?.[0]) {
      data.role = data.roles[0]
    }
    selectedUser.value = data
    showViewModal.value = true
  } catch (err) {
    console.error('Error viewing user:', err)
  }
}

const handleAddSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api('/v1/admin/users', {
      method: 'POST',
      body: {
        ...data,
        branch_ids: data.branch_ids?.length ? data.branch_ids : []
      }
    })
    success(t('messages.added_successfully', { item: t('labels.user') }))
    close()
    fetchUsers()
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

const handleEdit = (user) => {
  const data = { ...user }
  // ✅ Map role_id from nested object or array
  if (!data.role_id && data.role?.id) {
    data.role_id = data.role.id
  } else if (!data.role_id && data.roles?.[0]?.id) {
    data.role_id = data.roles[0].id
  }
  
  // ✅ Map branch_ids from nested array
  if (!data.branch_ids && data.branches?.length) {
    data.branch_ids = data.branches.map(b => b.id)
  }
  selectedEditUser.value = data
  showEditModal.value = true
}

const handleEditSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    const body = { 
      ...data,
      branch_ids: data.branch_ids?.length ? data.branch_ids : [] 
    }
    if (!body.password) delete body.password

    await api(`/v1/admin/users/${selectedEditUser.value.id}`, {
      method: 'PUT',
      body
    })
    success(t('messages.updated_successfully', { item: t('labels.user') }))
    close()
    fetchUsers()
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

const handleDelete = (user) => {
  selectedDeleteUser.value = user
  showDeleteModal.value = true
}

const handleDeleteConfirm = async ({ setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/v1/admin/users/${selectedDeleteUser.value.id}`, { method: 'DELETE' })
    success(t('messages.deleted_successfully', { item: t('labels.user') }))
    close()
    fetchUsers()
  } catch (err) {
    toastError(err?.data?.message || t('common.somethingWentWrong'))
    console.error('Error deleting user:', err)
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
const handleFilter = ({ search, branch_id } = {}) => {
  searchQuery.value = search ?? ''
  branchFilter.value = branch_id || null
  currentPage.value = 1
  fetchUsers()
}

const resetFilters = () => {
  searchQuery.value = ''
  branchFilter.value = null
  currentPage.value = 1
  fetchUsers()
}

/* =============================
   PROVIDE/INJECT
============================== */
const registerAddModal = inject('registerAddModal')
const unregisterAddModal = inject('unregisterAddModal')

/* =============================
   WATCHERS & LIFECYCLE
============================== */
watch(currentPage, () => fetchUsers())

onMounted(() => {
  fetchUsers().catch(console.error)
  fetchRoles().catch(console.error)
  fetchBranches().catch(console.error)
  registerAddModal?.(() => { showAddModal.value = true })
})

onBeforeUnmount(() => {
  unregisterAddModal?.()
})
</script>

<style>
.branches-list {
  padding-left: 1rem;
}

.branches-list li {
  margin-bottom: 0.5rem !important;
}
</style>