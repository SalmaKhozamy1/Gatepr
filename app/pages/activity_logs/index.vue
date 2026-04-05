<template>
  <PageLayout
    :hasAside="false"
    :formTitle="t('activity_logs.title')"
  >
    <template #search>
     <ClientOnly>
      <SearchBar
        :filters="searchFilters"
        :dateFilters="dateFilters"
        :loading="loading"
        @filter="handleFilter"
        @reset="resetFilters"
      />
     </ClientOnly>
    </template>
   
    <template #main>
      <TablesAppTable
        id="print-table"
        :headers="headers"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="perPage"
        :loading="loading"
        @update:current-page="handlePageChange"
      >
        <template #body="{ getIndex }">
          <tr v-if="!loading && logs.length === 0">
            <td :colspan="headers.length" class="text-center py-5 no-data">
              {{ t('common.no_results_found') }}
            </td>
          </tr>

          <tr v-for="(log, index) in logs" :key="log.id">
            <th class="index-cell">{{ getIndex(index) }}</th>
            <td>{{ formatDescription(log) }}</td>
            <td>{{ log.user_name?.[locale] || log.user_name?.ar || '—' }}</td>
            <td class="nowrap">{{ formatDate(log.created_at) }}</td>
            <td class="actions-cell">
              <div>
                <button
                  class="action-btn view"
                  :title="t('common.view')"
                  @click="handleView(log)"
                >
                  <IconsEye width="18" height="18" />
                </button>
                <button
                  class="action-btn print"
                  :title="t('buttons.print')"
                  @click="handlePrint(log)"
                >
                  <IconsPrint width="18" height="18" />
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
    :title="t('activity_logs.view_details')"
    :data="selectedLog"
    :fields="logViewFields"
    :icon="IconsLogs"
  >
    <template #extra-content>
      <div v-if="selectedLog?.properties" class="mt-4 activity-details">
        <div v-if="selectedLog.properties.old" class="changes-section old">
           <div class="section-badge">{{ t('activity_logs.old_values') }}</div>
           <div class="json-card">
              <pre class="json-viewer">{{ selectedLog.properties.old }}</pre>
           </div>
        </div>
        <div v-if="selectedLog.properties.attributes" class="changes-section new">
           <div class="section-badge success">{{ t('activity_logs.new_values') }}</div>
           <div class="json-card success">
              <pre class="json-viewer">{{ selectedLog.properties.attributes }}</pre>
           </div>
        </div>
      </div>
    </template>
  </ModalsAppViewModal>
</template>

<script setup>
definePageMeta({ middleware: 'auth', adminOnly: true })
usePageMeta('menu.activity_logs')

import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'
import { IconsLogs } from '#components'

const { t, locale } = useI18n()
const api = useApi()
const registerPageAction = inject('registerPageAction')
const { success, error } = useAppToast()

/* =============================
   STATE
============================== */
const logs = ref([])
const users = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 15
const loading = ref(false)

const filters = ref({
  date_from: '',
  date_to: '',
  user_name: null,
  description: null,
  log_name: null
})

const showViewModal = ref(false)
const selectedLog = ref(null)

/* =============================
   COMPUTED
============================== */
const headers = computed(() => [
  { label: '#', class: 'index-cell' },
  { label: t('activity_logs.event'), class: '' },
  { label: t('activity_logs.user'), class: '' },
  { label: t('activity_logs.date'), class: '' },
  { label: t('common.actions'), class: 'actions-cell' }
])

const combinedEventOptions = computed(() => {
  const actions = ['created', 'updated', 'deleted']
  const subjects = ['items', 'users', 'branches', 'suppliers', 'categories', 'static_pages', 'governorates', 'areas']
  const options = []

  subjects.forEach(subject => {
    actions.forEach(action => {
      options.push({
        label: `${t(`activity_logs.${action}`)} ${t(`activity_logs.subjects.${subject}`)}`,
        value: `${action}:${subject}`
      })
    })
  })
  return options
})

const userOptions = computed(() => {
  return users.value.map(u => ({
    label: u.name?.[locale.value] || u.name?.ar || u.name,
    value: u.name?.ar || u.name // Passing name as string for user_name filter
  }))
})

const searchFilters = computed(() => [
  {
    key: 'combined_event',
    placeholder: t('activity_logs.event'),
    options: combinedEventOptions.value
  },
  {
    key: 'user_name',
    placeholder: t('activity_logs.search_user'),
    options: userOptions.value
  }
])

const dateFilters = [
  { key: 'date_from', label: t('activity_logs.date_from') },
  { key: 'date_to',   label: t('activity_logs.date_to') }
]

const logViewFields = computed(() => [
  { label: t('activity_logs.event'), key: 'description' },
  { label: t('activity_logs.user'),  key: 'user_name.ar' },
  { label: t('activity_logs.date'),  key: 'created_at' },
  { label: t('activity_logs.subject_type'), key: 'subject_type' },
  { label: t('activity_logs.subject_id'),   key: 'subject_id' }
])

/* =============================
   HELPERS
============================== */
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

const formatDescription = (log) => {
  const desc = log.description || ''
  const model = log.log_name || ''
  
  // Custom translation logic
  const action = t(`activity_logs.${desc}`, desc)
  const modelTrans = t(`menu.${model}`, model)
  
  return `${action} ${modelTrans}`
}

const parseMeta = (meta = {}) => {
  const getValue = (val) => {
    if (Array.isArray(val)) return val[0] ?? 1
    return val ?? 1
  }
  return {
    lastPage: getValue(meta.last_page),
    currentPage: getValue(meta.current_page) || 1
  }
}

/* =============================
   FETCHERS
============================== */
const fetchLogs = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value,
      per_page: perPage,
      sort_by: 'created_at',
      sort_direction: 'desc'
    })

    if (filters.value.date_from)   params.append('date_from', filters.value.date_from)
    if (filters.value.date_to)     params.append('date_to', filters.value.date_to)
    if (filters.value.description) params.append('filters[description]', filters.value.description)
    if (filters.value.user_name)   params.append('filters[user_name]', filters.value.user_name)
    if (filters.value.log_name)    params.append('filters[log_name]', filters.value.log_name)

    const res = await api(`/v1/admin/activity-logs?${params}`)
    logs.value = res.data || []
    
    const meta = parseMeta(res.meta)
    totalPages.value = meta.lastPage
    currentPage.value = meta.currentPage
  } catch (err) {
    console.error('Error fetching logs:', err)
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const res = await api('/v1/admin/users?per_page=100')
    users.value = res.data || []
  } catch (err) {
    console.error('Error fetching users:', err)
  }
}

/* =============================
   ACTIONS
============================== */
const handleFilter = (form) => {
  const [desc, log] = form.combined_event ? form.combined_event.split(':') : [null, null]
  
  filters.value = {
    date_from: form.date_from || '',
    date_to: form.date_to || '',
    user_name: form.user_name || null,
    description: desc,
    log_name: log
  }
  currentPage.value = 1
  fetchLogs()
}

const resetFilters = () => {
  filters.value = {
    date_from: '',
    date_to: '',
    user_name: null,
    description: null,
    log_name: null
  }
  currentPage.value = 1
  fetchLogs()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchLogs()
}

const handleView = (log) => {
  selectedLog.value = log
  showViewModal.value = true
}

const handlePrint = (log) => {
  window.print()
}

const handleExport = async () => {
  try {
    const params = new URLSearchParams()
    if (filters.value.date_from)   params.append('date_from', filters.value.date_from)
    if (filters.value.date_to)     params.append('date_to', filters.value.date_to)
    if (filters.value.description) params.append('filters[description]', filters.value.description)
    if (filters.value.user_name)   params.append('filters[user_name]', filters.value.user_name)
    if (filters.value.log_name)    params.append('filters[log_name]', filters.value.log_name)

    const res = await api(`/v1/admin/activity-logs/export?${params}`)
    if (res.success && res.file_url) {
      window.open(res.file_url, '_blank')
    } else {
      error(t('activity_logs.messages.export_error'))
    }
  } catch (err) {
    console.error('Export error:', err)
    error(t('activity_logs.messages.export_error'))
  }
}

onMounted(() => {
  fetchLogs()
  fetchUsers()
  registerPageAction?.('download', handleExport)
})
</script>

<style scoped>
.json-viewer {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
  font-size: 13px;
  color: #333;
  direction: ltr;
}

.activity-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.changes-section {
  border: 1px solid #e9eaeb;
  border-radius: 12px;
  overflow: hidden;
}

.section-badge {
  background: #f4f5f6;
  padding: 8px 16px;
  font-weight: 500;
  border-bottom: 1px solid #e9eaeb;
}

.section-badge.success {
  background: #ecfdf3;
  color: #027a48;
}

.json-card {
  padding: 0;
}

.json-card pre {
  margin: 0;
  border-radius: 0;
  border: none;
}

@media print {
  /* Hides sidebar, header, search bar, and other UI elements */
  header, 
  nav, 
  .navbar,
  aside,
  #search-teleport-target,
  .SearchBar,
  .SearchBar-wrapper,
  .filters-card,
  .Pagination,
  .actions-cell,
  .custom-btn,
  .action-btn,
  .nav-item,
  .user_info,
  .header-actions {
    display: none !important;
  }

  /* Reset layout constraints for print */
  body, 
  .layout, 
  .content-layout, 
  .container, 
  .page-layout-container, 
  .side-page-layout, 
  .flex-column,
  .d-flex {
    display: block !important;
    background: #fff !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    width: 100% !important;
    min-height: unset !important;
  }

  .custom-card {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
  }

  .card-header {
    border: none !important;
    padding: 0 0 15px 0 !important;
  }

  .card-header h4 {
    font-size: 20px !important;
    color: #000 !important;
  }

  .card-content {
    padding: 0 !important;
  }

  /* Format the table for print */
  #print-table {
    width: 100% !important;
    display: table !important;
    border-collapse: collapse !important;
  }

  .table-responsive {
    overflow: visible !important;
    display: block !important;
    width: 100% !important;
  }

  .custom-table {
    width: 100% !important;
    border: 1px solid #000 !important;
  }

  .custom-table th, 
  .custom-table td {
    border: 1px solid #000 !important;
    padding: 10px !important;
    color: #000 !important;
    background: transparent !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Remove column sizes that might break print */
  .index-cell {
    width: 30px !important;
  }
}
</style>