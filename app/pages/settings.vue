<template>
  <div class="settings-wrapper position-relative">
    <!-- if fullPage meta is true, render NuxtPage directly without the layout wrapper -->
    <template v-if="route.meta.fullPage">
      <NuxtPage />
    </template>

    <PageLayout
      v-else
      :asideTitle="t('settings.title')"
      :asideItems="settingsMenu"
      :activeIndex="activeIndex"
      :formTitle="`${t('settings.record')} ${activeTabTitle}`"
      :hasSearch="activeHasSearch"
      @item-click="handleTabClick"
    >
      <template #search>
        <!-- The target is now safely managed here by the layout, but let's ensure it's robust -->
        <div id="search-teleport-target" class="w-100"></div>
      </template>

      <template #header-actions>
        <button
          v-if="activeHasActions"
          class="custom-btn primary-btn fltr_btn"
          @click="handleAddClick"
        >
          <span style="font-size: 20px">+</span>
          <span class="ms-1">{{ t('common.add') }} {{ activeTabAddTitle }}</span>
        </button>
      </template>

      <template #main>
        <NuxtPage />
      </template>
    </PageLayout>
    
    <!-- Fallback hidden target to prevent Teleport crashes during unmounting phase -->
    <div v-if="route.meta.fullPage" id="search-teleport-target" class="d-none"></div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth', adminOnly: true })
usePageMeta('menu.settings')

import { 
  IconsGovernorates,
  IconsSettingsRegions,
  IconsSettingsUsers,
  IconsSettingsRoles,
  IconsCategories,
  IconsSuppliers,
  IconsUnits,
  IconsReceiveType,
  IconsTerms
} from '#components'

import { provide, ref, computed, onMounted } from 'vue'

// ✅ provide للـ register والـ unregister
const addModalOpener = ref(null)

provide('registerAddModal', (fn) => {
  addModalOpener.value = fn
})

provide('unregisterAddModal', () => {
  addModalOpener.value = null
})

const handleAddClick = () => {
  addModalOpener.value?.()
}

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const settingsMenu = computed(() => [
  { title: t('settings.governorates'), icon: IconsGovernorates, path: localePath('/settings/governorates'), addTitle: t('settings.add_governorate') },
  { title: t('settings.areas'), icon: IconsSettingsRegions, path: localePath('/settings/areas'), addTitle: t('settings.add_area') },
  { title: t('settings.users'), icon: IconsSettingsUsers, path: localePath('/settings/users'), addTitle: t('settings.add_user') },
  { title: t('settings.roles'), icon: IconsSettingsRoles, path: localePath('/settings/roles'), addTitle: t('settings.add_role') },
  { title: t('settings.supplier_types'), icon: IconsSuppliers, path: localePath('/settings/supplier_types'), addTitle: t('settings.add_supplier_type') },
  { title: t('settings.categories'), icon: IconsCategories, path: localePath('/settings/categories'), addTitle: t('settings.add_category') },
  { title: t('settings.purchasing_units'), icon: IconsUnits, path: localePath('/settings/purchasing_units'), addTitle: t('settings.add_purchasing_unit') },
  { title: t('settings.receipt_types'), icon: IconsReceiveType, path: localePath('/settings/receipt_types'), addTitle: t('settings.add_receipt_type') },
  { title: t('settings.terms_and_conditions'), icon: IconsTerms, path: localePath('/settings/terms-and-conditions'), addTitle: t('settings.add_term'), hasSearch: false, hasActions: false  },
])

const activeHasSearch = computed(() => settingsMenu.value[activeIndex.value]?.hasSearch ?? true)
const activeHasActions = computed(() => settingsMenu.value[activeIndex.value]?.hasActions ?? true)

const activeIndex = computed(() => {
  const index = settingsMenu.value.findIndex(item => item.path === route.path)
  return index !== -1 ? index : 0
})

const activeTabTitle = computed(() => settingsMenu.value[activeIndex.value]?.title || t('settings.title'))
const activeTabAddTitle = computed(() => settingsMenu.value[activeIndex.value]?.addTitle || '')

const handleTabClick = (index) => {
  const item = settingsMenu.value[index]
  
  if (!item || !item.path) return

  navigateTo(item.path)
}

onMounted(() => {
  if (route.path === localePath('/settings') || route.path === localePath('/settings/')) {
    navigateTo(localePath('/settings/governorates'))
  }
})
</script>

<style scoped>
.form-group {
  width: unset;
  flex: 1;
}
</style>
