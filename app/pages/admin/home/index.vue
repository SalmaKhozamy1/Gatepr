<template>
    <CardsCustomCard title="نظرة عامة">
        <div class="grid grid-3">
            <CardsStatisticsCard :CardNo="56" IconBg="#64CBF4" title="عدد الفروع">
               <template #icon>
                <IconsBranches :isFilled="true" />
               </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="20" IconBg="#F0BA3E" title="طلبات التسجيل قيد الإنتظار">
                <template #icon>
                    <IconsRegistrationPending />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="50" IconBg="#408BFB" title="الموردين المقبولين">
                <template #icon>
                    <IconsSuppliers />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="30" IconBg="#F3616A" title="طلبات الأصناف قيد الإنتظار">
                <template #icon>    
                    <IconsRequestPending />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="54336" IconBg="#02C697" title="طلبات الأصناف المقبولة">
                <template #icon>
                    <IconsRequestApprove />
                </template>
            </CardsStatisticsCard>
            <CardsStatisticsCard :CardNo="15533" IconBg="#AF72FF" title="عدد الأصناف">
                <template #icon>
                    <IconsCategories />
                </template>
            </CardsStatisticsCard>
        </div>
    </CardsCustomCard>  
</template>

<script setup>
</script>