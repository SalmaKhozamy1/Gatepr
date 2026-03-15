
<template>
  <div>
    <Teleport to="#search-teleport-target">
      <div class="flex-start gap-sm w-100 flex-wrap">
        <InputsFormInput 
          v-model="searchQuery"
          :placeholder="t('pages.search')" 
          class="flex-grow-1 min-w-40 col"
        />
        <div class="flex-start gap-sm">
          <button class="custom-btn primary-btn min-btn-width fltr_btn" @click="handleFilter">
            <IconsSearch />
            <span>{{ t('buttons.search') }}</span>
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
        <tr v-if="!loading && rolesNum.length === 0">
          <td :colspan="headers.length" class="text-center danger">
            {{ t('errors.somethingWentWrong') }}
          </td>
        </tr>
        <tr v-for="(role, index) in rolesNum" :key="role.id">
          <th class="index-cell">{{ getIndex(index) }}</th>
          <td>{{ role.name_localized?.[locale] || role.name }}</td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" :title="t('buttons.view')" @click="handleView(role.id)">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" :title="t('buttons.edit')" @click="handleEdit(role.id)">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" :title="t('buttons.delete')" @click="handleDelete(role.id)">
                <IconsDelete width="18" height="18" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>
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

const headers = computed(() => [
  { label: t('labels.id'), class: 'index-cell' },
  { label: t('labels.role'), class: '' },
  { label: t('labels.actions'), class: 'actions-cell' }
])

const handleView = (id) => console.log('view', id)
const handleEdit = (id) => console.log('edit', id)
const handleDelete = (id) => console.log('delete', id)

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
