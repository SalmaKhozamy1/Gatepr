<template>
    <CardsCustomCard :title="t('settings.terms_and_conditions')"> 
        <AppTerms></AppTerms>
    </CardsCustomCard>
</template>

<script setup>
definePageMeta({ middleware: 'auth', supplierOnly: true })
usePageMeta('menu.terms_and_conditions')
const { t } = useI18n()
</script>