<template>
  <div class="supplier-home-page d-flex flex-column gap-4">
    
    <!-- Quick Actions -->
    <CardsCustomCard :title="t('home.quick_actions')">
      <div class="d-flex w-100">
        <button class="custom-btn gray-btn min-btn-width" 
        @click="$router.push(localePath('/item-managment/add'))">
          <span style="font-size: 18px;">+</span> {{ t('home.create_item_request') }}
        </button>
      </div>
    </CardsCustomCard>

    <!-- Overview -->
    <CardsCustomCard :title="t('home.overview')">
      <template #actions>
        <InputsFormSelect 
        v-model="filterPeriod"
        :options="periodOptions"></InputsFormSelect>
      </template>

      <div class="grid grid-3">
        <CardsStatisticsCard :CardNo="dashboard?.pending_items?.count || 30" IconBg="#F0BA3E" :title="t('home.Number_of_pending_items')">
            <template #icon>
                <IconsRegistrationPending />
            </template>
        </CardsStatisticsCard>
        <CardsStatisticsCard :CardNo="dashboard?.accepted_items?.count || 54336" IconBg="#02C697" :title="t('home.Number_of_accepted_items')">
            <template #icon>
                <IconsRequestApprove />
            </template>
        </CardsStatisticsCard>
        <CardsStatisticsCard :CardNo="dashboard?.rejected_items?.count || 54336" IconBg="#F3616A" :title="t('home.Number_of_rejected_items')">
            <template #icon>
                <IconsRequestPending /> 
            </template>
        </CardsStatisticsCard>
      </div>
    </CardsCustomCard>

    <!-- Table (Latest Accepted Items) -->
    <CardsCustomCard :title="t('home.latest_accepted_items')">
      <template #actions>
        <NuxtLink :to="localePath('/item-managment')" class="custom-anc secondary">
          <h5>{{ t('common.view_all') }}</h5>
        </NuxtLink>
      </template>
      
      <TablesAppTable
        :headers="tableHeaders"
        :current-page="1"
        :total-pages="1"
        :per-page="5"
        :loading="loading"
        @update:current-page="() => {}"
      >
        <template #body="{ getIndex }">
          <tr v-for="(item, index) in recentItems" :key="index">
            <th class="index-cell">{{ index + 1 }}</th>
            <td>{{ item.number }}</td>
            <td>{{ item.date }}</td>
            <td class="actions-cell">
              <button class="action-btn view" title="عرض">
                <IconsEye width="18" height="18" />
              </button>
            </td>
          </tr>
        </template>
      </TablesAppTable>
    </CardsCustomCard>

  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});
usePageMeta('menu.home')

const { t, locale } = useI18n()
const localePath = useLocalePath()
const api = useApi()

const dashboard = ref(null)
const loading = ref(false)
const filterPeriod = ref('month')

const periodOptions = [
  { label: t('home.month'), value: 'month' },
  { label: t('home.week'), value: 'week' },
  { label: t('home.year'), value: 'year' }
]
// Headers for the recent accepted items table
const tableHeaders = [
  { label: '#', class: 'index-cell' },
  { label: t('common.item_number'), class: '' },
  { label: t('common.acceptance_date'), class: '' },
  { label: t('common.actions'), class: 'actions-cell' }
]

// Mock data to match the image until API is connected
const recentItems = ref([
  { number: '115415', date: '5-5-2025' },
  { number: '61566', date: '5-5-2025' },
  { number: '361323', date: '5-5-2025' },
  { number: '1215', date: '5-5-2025' }
])

onMounted(async () => {
  loading.value = true
  try {
    const res = await api('/v1/admin/dashboard', { method: 'GET' }) 
    dashboard.value = res.data
  } catch (err) {
    console.error('Dashboard error:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.supplier-home-page {
  width: 100%;
}
.filter-select {
  padding: 6px 30px 6px 12px;
  border: 1px solid #E0E1E5;
  border-radius: 8px;
  font-size: 14px;
  color: #667085;
  background-color: #fff;
  cursor: pointer;
  outline: none;
}
.action-btn.view {
  color: #98A2B3;
  padding: 4px;
}
.action-btn.view:hover {
  color: var(--primary-color);
}
</style>