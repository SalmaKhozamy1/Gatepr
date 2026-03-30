<template>
  <div class="home-page d-flex flex-column gap-4">

    <!-- ========== SUPPLIER VIEW ========== -->
    <template v-if="isSupplier">

      <!-- Quick Actions -->
      <CardsCustomCard :title="t('home.quick_actions')">
        <div class="d-flex w-100">
          <button
            class="custom-btn gray-btn min-btn-width"
            @click="$router.push(localePath('/item-managment/add'))"
          >
            <span style="font-size: 18px;">+</span>
            {{ t('home.create_item_request') }}
          </button>
        </div>
      </CardsCustomCard>

      <!-- Overview -->
      <CardsCustomCard :title="t('home.overview')">
        <template #actions>
          <InputsFormSelect v-model="filterPeriod" :options="periodOptions" />
        </template>

        <div class="grid grid-3">
          <CardsStatisticsCard
            :CardNo="dashboard?.pending_items?.count"
            IconBg="#F0BA3E"
            :title="t('home.Number_of_pending_items')"
            :loading="loading"
          >
            <template #icon><IconsRegistrationPending /></template>
          </CardsStatisticsCard>

          <CardsStatisticsCard
            :CardNo="dashboard?.accepted_items?.count"
            IconBg="#02C697"
            :title="t('home.Number_of_accepted_items')"
            :loading="loading"
          >
            <template #icon><IconsRequestApprove /></template>
          </CardsStatisticsCard>

          <CardsStatisticsCard
            :CardNo="dashboard?.rejected_items?.count"
            IconBg="#F3616A"
            :title="t('home.Number_of_rejected_items')"
            :loading="loading"
          >
            <template #icon><IconsRequestPending /></template>
          </CardsStatisticsCard>
        </div>
      </CardsCustomCard>

      <!-- Latest Accepted Items Table -->
      <CardsCustomCard :title="t('home.latest_accepted_items')">
        <template #actions>
          <NuxtLink :to="localePath('/item-managment')" class="custom-anc secondary">
            <h5>{{ t('common.view_all') }}</h5>
          </NuxtLink>
        </template>

        <TablesAppTable
          :headers="supplierTableHeaders"
          :current-page="1"
          :total-pages="1"
          :per-page="5"
          :loading="loading"
          @update:current-page="() => {}"
        >
          <template #body>
            <tr v-for="(item, index) in recentItems" :key="index">
              <th class="index-cell">{{ index + 1 }}</th>
              <td>{{ item.code || '—' }}</td>
              <td>{{ item.accepted_at || '—' }}</td>
              <td class="actions-cell">
                <button class="action-btn view">
                  <IconsEye width="18" height="18" />
                </button>
              </td>
            </tr>
          </template>
        </TablesAppTable>
      </CardsCustomCard>

    </template>

    <!-- ========== ADMIN VIEW ========== -->
    <template v-else>

      <CardsCustomCard :title="t('home.overview')">
        <div class="grid grid-3">
          <CardsStatisticsCard
            :CardNo="dashboard?.branches?.count"
            IconBg="#64CBF4"
            :title="t('home.Number_of_branches')"
            :loading="loading"
          >
            <template #icon><IconsFillBranches /></template>
          </CardsStatisticsCard>

          <CardsStatisticsCard
            :CardNo="dashboard?.pending_suppliers?.count"
            IconBg="#F0BA3E"
            :title="t('home.Number_of_pending_suppliers')"
            :loading="loading"
          >
            <template #icon><IconsRegistrationPending /></template>
          </CardsStatisticsCard>

          <CardsStatisticsCard
            :CardNo="dashboard?.approved_suppliers?.count"
            IconBg="#408BFB"
            :title="t('home.Number_of_approved_suppliers')"
            :loading="loading"
          >
            <template #icon><IconsFillSuplliers /></template>
          </CardsStatisticsCard>

          <CardsStatisticsCard
            :CardNo="dashboard?.pending_items?.count"
            IconBg="#F3616A"
            :title="t('home.Number_of_pending_items')"
            :loading="loading"
          >
            <template #icon><IconsRequestPending /></template>
          </CardsStatisticsCard>

          <CardsStatisticsCard
            :CardNo="dashboard?.accepted_items?.count"
            IconBg="#02C697"
            :title="t('home.Number_of_accepted_items')"
            :loading="loading"
          >
            <template #icon><IconsRequestApprove /></template>
          </CardsStatisticsCard>

          <CardsStatisticsCard
            :CardNo="dashboard?.total_items?.count"
            IconBg="#AF72FF"
            :title="t('home.total_items')"
            :loading="loading"
          >
            <template #icon><IconsCategories /></template>
          </CardsStatisticsCard>
        </div>
      </CardsCustomCard>

    </template>

  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
usePageMeta('menu.home')

const { t } = useI18n()
const localePath = useLocalePath()
const api = useApi()
const role = useCookie('role')

/* =============================
   ROLE
============================== */
const isSupplier = computed(() => role.value === 'supplier')

/* =============================
   STATE
============================== */
const dashboard = ref(null)
const loading = ref(false)
const filterPeriod = ref('month')
const recentItems = ref([])

/* =============================
   OPTIONS
============================== */
const periodOptions = [
  { label: t('home.month'), value: 'month' },
  { label: t('home.week'),  value: 'week'  },
  { label: t('home.year'),  value: 'year'  },
]

/* =============================
   TABLE HEADERS
============================== */
const supplierTableHeaders = computed(() => [
  { label: '#',                         class: 'index-cell'   },
  { label: t('common.item_number'),     class: ''             },
  { label: t('common.acceptance_date'), class: ''             },
  { label: t('common.actions'),         class: 'actions-cell' },
])

/* =============================
   FETCH
============================== */
const fetchDashboard = async () => {
  try {
    loading.value = true
    const endpoint = isSupplier.value
      ? '/v1/supplier/dashboard' 
      : '/v1/admin/dashboard'

    const res = await api(endpoint, { method: 'GET' })
    dashboard.value = res.data

    // لو supplier نجيب أحدث الـ accepted items
    if (isSupplier.value) {
      recentItems.value = res.data?.recent_accepted_items || []
    }
  } catch (err) {
    console.error('Dashboard error:', err)
  } finally {
    loading.value = false
  }
}

/* =============================
   WATCH filter period (supplier only)
============================== */
watch(filterPeriod, () => {
  if (isSupplier.value) fetchDashboard()
})

/* =============================
   LIFECYCLE
============================== */
onMounted(() => fetchDashboard())
</script>