<template>
    <CardsCustomCard title="نظرة عامة">
        <div class="grid grid-3">
            <CardsStatisticsCard :CardNo="dashboard?.branches?.count" IconBg="#64CBF4" title="عدد الفروع">
               <template #icon>
                <IconsFillBranches />
               </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="dashboard?.pending_suppliers?.count" IconBg="#F0BA3E" title="طلبات التسجيل قيد الإنتظار">
                <template #icon>
                    <IconsRegistrationPending />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="dashboard?.approved_suppliers?.count" IconBg="#408BFB" title="الموردين المقبولين">
                <template #icon>
                    <IconsFillSuplliers />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="dashboard?.pending_items?.count" IconBg="#F3616A" title="طلبات الأصناف قيد الإنتظار">
                <template #icon>    
                    <IconsRequestPending />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="dashboard?.accepted_items?.count" IconBg="#02C697" title="طلبات الأصناف المقبولة">
                <template #icon>
                    <IconsRequestApprove />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="dashboard?.total_items?.count" IconBg="#AF72FF" title="عدد الأصناف">
                <template #icon>
                    <IconsCategories />
                </template>
            </CardsStatisticsCard>
        </div>
    </CardsCustomCard>  
</template>

<script setup>
import { useApi } from '@/Composables/useApi'
import { useAuthStore } from '@/stores/auth'

const api = useApi()
const authStore = useAuthStore();
console.log(authStore.user)

const { data: dashboardData, error} = await useAsyncData('dashboard', () =>
  api('/admin/dashboard', {
    method: 'GET'
  })
)

const dashboard = computed(() => dashboardData.value?.data)
console.log("dashboardData", dashboardData)

</script>