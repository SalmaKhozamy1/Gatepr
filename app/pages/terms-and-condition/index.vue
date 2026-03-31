<template>
    <CardsCustomCard :title="t('settings.terms_and_conditions')"> 
        <AppTerms></AppTerms>
    </CardsCustomCard>
</template>

<script setup>
const { t } = useI18n()
</script>