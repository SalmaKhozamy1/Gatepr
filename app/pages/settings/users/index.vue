<template>
  <div>
   <Teleport to="#search-teleport-target">
      <div class="flex-start gap-sm w-100 flex-wrap">
        <div class="flex-grow-1 flex-start gap-sm">
          <InputsFormInput
            v-model="searchQuery"
            placeholder="بحث عن منطقة .."
          />
          <!-- ✅ Filter بالمحافظة -->
          <InputsFormSelect
            v-model="selectedGovernorateFilter"
            :options="governorateOptions"
            placeholder="كل المحافظات"
            @update:model-value="handleFilter(searchQuery)"
          />
        </div>
        <div class="flex-start gap-sm">
          <button class="custom-btn primary-btn min-btn-width fltr_btn" @click="handleFilter(searchQuery)">
            <IconsSearch />
            <span>بحث</span>
          </button>
          <ButtonsResetButton @reset="resetFilters" />
        </div>
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
        <tr v-if="!loading && users.length === 0">
          <td :colspan="headers.length" class="text-center">
            لا يوجد مستخدمون للعرض
          </td>
        </tr>

        <tr v-for="user in users" :key="user.id">
          <th class="index-cell">{{ user.id }}</th>
          <td>{{ user.name?.ar }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.branches?.length ? user.branches.map(b => b.name).join('، ') : '—' }}</td>
          <td>{{ user.role?.name || '—' }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" title="عرض" @click="handleView(user.id)" :disabled="viewLoading">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" title="تعديل" @click="handleEdit(user)">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" title="حذف" @click="handleDelete(user)">
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
    title="عرض مستخدم"
    :data="selectedUser"
    :fields="userViewFields"
    :icon="IconsSettingsUsers"
  />

  <!-- Add Modal -->
  <ModalsAppAddModal
    v-model="showAddModal"
    title="إضافة مستخدم"
    :icon="IconsSettingsUsers"
    :fields="userFormFields"
    @submit="handleAddSubmit"
  />

  <!-- Edit Modal -->
  <ModalsAppEditModal
    v-model="showEditModal"
    title="تعديل مستخدم"
    :icon="IconsSettingsUsers"
    :fields="userEditFields"
    :initial-data="selectedEditUser"
    @submit="handleEditSubmit"
  />

  <!-- Delete Modal -->
  <ModalsAppDeleteModal
    v-model="showDeleteModal"
    title="حذف المستخدم"
    itemType="مستخدم"
    :itemName="selectedDeleteUser?.name?.ar"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useView } from '~/composables/useView'
import { IconsSettingsUsers } from '#components'

const api = useApi()
const { viewItem, loading: viewLoading } = useView()

/* =============================
   STATE
============================== */
const searchQuery = ref('')
const users = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)

const showViewModal = ref(false)
const selectedUser = ref(null)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEditUser = ref(null)
const showDeleteModal = ref(false)
const selectedDeleteUser = ref(null)

const headers = [
  { label: '#', class: 'index-cell' },
  { label: 'الإسم', class: '' },
  { label: 'البريد الإلكتروني', class: '' },
  { label: 'الهاتف', class: '' },
  { label: 'الفروع', class: '' },
  { label: 'الدور', class: '' },
  { label: 'الإجراءات', class: 'actions-cell' }
]

const userViewFields = [
  { label: 'اسم المستخدم باللغة العربية', key: 'name.ar' },
  { label: 'اسم المستخدم باللغة الإنجليزية', key: 'name.en' },
  { label: 'البريد الإلكتروني', key: 'email' },
  { label: 'كلمة المرور', key: 'password' },
  { label: 'الهاتف', key: 'phone' },
  { label: 'الدور', key: 'role.name' },
  { label: 'الفرع', key: 'branches' },
]

const userFormFields = [
  { key: 'name.ar', label: 'اسم المستخدم باللغة العربية ', placeholder: 'ادخل الاسم باللغة العربية' },
  { key: 'name.en', label: 'الاسم بالإنجليزي', placeholder: 'ادخل الاسم باللغة الإنجليزية' },
  { key: 'email', label: 'البريد الإلكتروني', placeholder: 'example@email.com', type: 'email' },
  { key: 'phone', label: 'الهاتف', placeholder: '96512345678', type: 'tel' },
   { key: 'password', label: 'كلمة المرور ', placeholder: 'اتركه فارغاً إن لم تريد التغيير', type: 'password' },
  { key: 'role_id', label: 'الأدوار', placeholder: 'ادخل رقم الدور', type: 'number' },
  { key: 'branches', label: 'الفروع', placeholder: 'ادخل رقم الفرع', type: 'number' },
] 

// Edit بدون password - اختياري
const userEditFields = [
  { key: 'name.ar', label: 'اسم المستخدم باللغة الإنجليزية ', placeholder: 'ادخل الاسم باللغة العربية' },
  { key: 'name.en', label: 'اسم المستخدم باللغة الإنجليزية ', placeholder: 'ادخل الاسم باللغة الإنجليزية' },
  { key: 'email', label: 'البريد الإلكتروني', placeholder: 'example@email.com', type: 'email' },
  { key: 'phone', label: 'الهاتف', placeholder: '96512345678', type: 'tel' },
  { key: 'password', label: 'كلمة المرور ', placeholder: 'اتركه فارغاً إن لم تريد التغيير', type: 'password' },
  { key: 'role_id', label: 'الأدوار', placeholder: 'ادخل رقم الدور', type: 'number' },
  { key: 'branches', label: 'الفروع', placeholder: 'ادخل رقم الفرع', type: 'number' },
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
const fetchUsers = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort: 'created_at',
    })
    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim())
    }
    const res = await api(`/admin/users?${params}`)
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
    selectedUser.value = data
    showViewModal.value = true
  } catch (err) {
    console.error('Error viewing user:', err)
  }
}

const handleAddSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    await api('/admin/users', {
      method: 'POST',
      body: {
        ...data,
        branch_ids: [],   // ✅ required في الـ API
      }
    })
    close()
    fetchUsers()
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

const handleEdit = (user) => {
  selectedEditUser.value = user
  showEditModal.value = true
}

const handleEditSubmit = async ({ data, setErrors, setLoading, close }) => {
  try {
    setLoading(true)
    // شيل الـ password لو فاضي
    const body = { ...data, branch_ids: [] }
    if (!body.password) delete body.password

    await api(`/admin/users/${selectedEditUser.value.id}`, {
      method: 'PUT',
      body
    })
    close()
    fetchUsers()
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

const handleDelete = (user) => {
  selectedDeleteUser.value = user
  showDeleteModal.value = true
}

const handleDeleteConfirm = async ({ setLoading, close }) => {
  try {
    setLoading(true)
    await api(`/admin/users/${selectedDeleteUser.value.id}`, {
      method: 'DELETE'
    })
    close()
    fetchUsers()
  } catch (err) {
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
const handleFilter = (query) => {
  searchQuery.value = query
  currentPage.value = 1
  fetchUsers()
}

const resetFilters = () => {
  searchQuery.value = ''
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
  fetchUsers()
  registerAddModal?.(() => {
    showAddModal.value = true
  })
})

onBeforeUnmount(() => {
  unregisterAddModal?.()
})
</script>