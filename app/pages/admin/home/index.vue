<template>
    <CardsCustomCard :title="t('home.overview')">
        <div class="grid grid-3">
            <CardsStatisticsCard :CardNo="dashboard?.branches?.count" IconBg="#64CBF4" :title="t('home.branches')">
               <template #icon>
                <IconsFillBranches />
               </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="dashboard?.pending_suppliers?.count" IconBg="#F0BA3E" :title="t('home.pending_suppliers')">
                <template #icon>
                    <IconsRegistrationPending />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="dashboard?.approved_suppliers?.count" IconBg="#408BFB" :title="t('home.approved_suppliers')">
                <template #icon>
                    <IconsFillSuplliers />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="dashboard?.pending_items?.count" IconBg="#F3616A" :title="t('home.pending_items')">
                <template #icon>    
                    <IconsRequestPending />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="dashboard?.accepted_items?.count" IconBg="#02C697" :title="t('home.accepted_items')">
                <template #icon>
                    <IconsRequestApprove />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="dashboard?.total_items?.count" IconBg="#AF72FF" :title="t('home.total_items')">
                <template #icon>
                    <IconsCategories />
                </template>
            </CardsStatisticsCard>
        </div>
    </CardsCustomCard>  
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});
usePageMeta('menu.home')

const { t } = useI18n()
const api = useApi()
const dashboard = ref(null)

onMounted(async () => {
  try {
    const res = await api('/v1/admin/dashboard', { method: 'GET' }) 
    console.log('res:', res)
    dashboard.value = res.data
  } catch (err) {
    console.error('Dashboard error:', err)
  }
})
</script>