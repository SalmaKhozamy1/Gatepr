<template>
    <CardsCustomCard title="نظرة عامة">
        <div class="grid grid-3">
            <CardsStatisticsCard :CardNo="branchesCount" IconBg="#64CBF4" title="عدد الفروع">
               <template #icon>
                <IconsFillBranches />
               </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="requestsCount" IconBg="#F0BA3E" title="طلبات التسجيل قيد الإنتظار">
                <template #icon>
                    <IconsRegistrationPending />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="suppliersCount" IconBg="#408BFB" title="الموردين المقبولين">
                <template #icon>
                    <IconsFillSuplliers />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="approvedRequestsCount" IconBg="#F3616A" title="طلبات الأصناف قيد الإنتظار">
                <template #icon>    
                    <IconsRequestPending />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="productsCount" IconBg="#02C697" title="طلبات الأصناف المقبولة">
                <template #icon>
                    <IconsRequestApprove />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="categoriesCount" IconBg="#AF72FF" title="عدد الأصناف">
                <template #icon>
                    <IconsCategories />
                </template>
            </CardsStatisticsCard>
             {{ authStore.user?.name }}
        </div>
    </CardsCustomCard>  
</template>

<script setup>
import { useApi } from '@/Composables/useApi'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const api = useApi()
const authStore = useAuthStore();
console.log(authStore.user)

const categoriesCount = ref(0)
const suppliersCount = ref(0)
const branchesCount = ref(0)
const requestsCount = ref(0)
const approvedRequestsCount = ref(0)
const productsCount = ref(0)

const getDashboardStats = async () => {

    try {
        const dashboardData = await api.get('/admin/dashboard');
        console.log(dashboardData)
          
    } catch (error) {
        console.log(error)
    }
}
onMounted(() => {
    getDashboardStats()
})

</script>