<template>
  <div>
    <Teleport to="#search-teleport-target">
      <div class="flex-start gap-sm w-100 flex-wrap">
        <InputsFormInput 
          v-model="searchQuery"
          :placeholder="t('common.search')" 
          class="flex-grow-1 min-w-40 col"
        />
        <div class="flex-start gap-sm">
          <button class="custom-btn primary-btn min-btn-width fltr_btn" @click="handleFilter">
            <IconsSearch />
            <span>{{ t('common.search') }}</span>
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
      @update:current-page="fetchRoles"
    >
      <template #body="{ getIndex }">
        <!-- ✅ No data found message -->
        <tr v-if="!loading && rolesNum.length === 0">
          <td :colspan="headers.length" class="text-center py-5 no-data">
            <div class="flex-column-center gap-sm">
              <IconsSearch width="40" height="40" fill="#98A2B3" />
              <p class="text-gray-500">{{ t('common.no_results_found') }}</p>
            </div>
          </td>
        </tr>
        
        <tr v-for="(role, index) in rolesNum" :key="role.id">
          <th class="index-cell">{{ getIndex(index) }}</th>
          <td>{{ role.name_localized?.[locale] || role.name }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" :title="t('common.view')" @click="handleView(role.id)">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" :title="t('common.edit')" @click="handleEdit(role.id)" :disabled="role.id === 1">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" :title="t('common.delete')" @click="handleDelete(role)" :disabled="role.id === 1">
                <IconsDelete width="18" height="18" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>

    <!-- Delete Modal -->
    <ModalsAppDeleteModal
      v-model="showDeleteModal"
      :title="t('common.delete') + ' ' + t('labels.role')"
      :itemType="t('labels.role')"
      :itemName="selectedRoleName"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, inject, onBeforeUnmount, computed } from 'vue'
import { useApi } from '~/composables/useApi'

const localePath = useLocalePath()
const { t, locale } = useI18n()
const api = useApi()
const searchQuery = ref('')
const rolesNum = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)

// Delete Modal State
const showDeleteModal = ref(false)
const selectedRole = ref(null)

const selectedRoleName = computed(() => {
  if (!selectedRole.value) return ''
  return selectedRole.value.name_localized?.[locale.value] || selectedRole.value.name
})

const headers = computed(() => [
  { label: t('common.id'), class: 'index-cell' },
  { label: t('labels.role'), class: '' },
  { label: t('common.actions'), class: 'actions-cell' }
])

const handleView = (id) => navigateTo(localePath(`/settings/roles/${id}`))
const handleEdit = (id) => navigateTo(localePath(`/settings/roles/${id}/edit`))

const handleDelete = (role) => {
  selectedRole.value = role
  showDeleteModal.value = true
}

const handleDeleteConfirm = async ({ setLoading, close }) => {
  if (!selectedRole.value) return
  try {
    setLoading(true)
    await api(`/v1/admin/roles/${selectedRole.value.id}`, { method: 'DELETE' })
    close()
    if (rolesNum.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    fetchRoles(currentPage.value)
  } catch (err) {
    console.error('Error deleting role:', err)
  } finally {
    setLoading(false)
  }
}

const fetchRoles = async (page = 1) => {
  currentPage.value = typeof page === 'number' ? page : 1
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
    })
    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim())

    const res = await api(`/v1/admin/roles?${params}`)
    rolesNum.value = res.data || []
    totalPages.value = res.meta?.last_page || 1
  } catch (err) {
    console.error('Error fetching roles:', err)
  } finally {
    loading.value = false
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchRoles()
}

const resetFilters = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchRoles()
}

/* =============================
   PROVIDE/INJECT
============================== */
const registerAddModal = inject('registerAddModal')
const unregisterAddModal = inject('unregisterAddModal')

onMounted(() => {
  fetchRoles()
  registerAddModal?.(() => { 
    navigateTo(localePath('/settings/roles/add'))
  })
})

onBeforeUnmount(() => {
  unregisterAddModal?.()
})
</script>

<style scoped>
.action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.no-data {
  color: #98A2B3;
  font-size: 16px;
}
</style>
