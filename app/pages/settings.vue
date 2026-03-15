<template>
  <div class="settings-wrapper">
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
        <div id="search-teleport-target" class="w-100"></div>
      </template>

      <template #header-actions>
        <button
          v-if="activeHasActions"
          class="custom-btn primary-btn min-btn-width fltr_btn py-2"
          @click="handleAddClick"
        >
          <span style="font-size: 20px">+</span>
          <span class="ms-1">{{ t('settings.add') }} {{ activeTabAddTitle }}</span>
        </button>
      </template>

      <template #main>
        <NuxtPage />
      </template>
    </PageLayout>
  </div>
</template>

<script setup>
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
  { title: t('settings.supplier_types'), icon: IconsSuppliers, path: localePath('/settings/supplier-types'), addTitle: t('settings.add_supplier_type') },
  { title: t('settings.categories'), icon: IconsCategories, path: localePath('/settings/categories'), addTitle: t('settings.add_category') },
  { title: t('settings.purchasing_units'), icon: IconsUnits, path: localePath('/settings/purchasing-units'), addTitle: t('settings.add_purchasing_unit') },
  { title: t('settings.receipt_types'), icon: IconsReceiveType, path: localePath('/settings/receipt-types'), addTitle: t('settings.add_receipt_type') },
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
  if (item) navigateTo(item.path)
}

onMounted(() => {
  if (route.path === localePath('/settings') || route.path === localePath('/settings/')) {
    navigateTo(localePath('/settings/governorates'))
  }
})
</script>

<style scoped>
.settings-wrapper {
  position: relative;
}
.fltr_btn {
  min-height: 42.5px;
}
.reset_btn {
  color: var(--placeholder);
  border-color: var(--placeholder);
}
.min-w-40 {
  min-width: 200px;
}
.page-title {
  font-size: 28px;
}
.form-group {
  width: unset;
  flex: 1;
}
.breadcrumb {
  background: transparent;
  padding: 0;
  font-size: 14px;
}
.breadcrumb-item + .breadcrumb-item::before {
  content: ">";
  color: rgba(255, 255, 255, 0.5);
  padding: 0 8px;
}
.breadcrumb-item a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}
.breadcrumb-item.active {
  color: #fff;
}
[dir="rtl"] .breadcrumb-item + .breadcrumb-item::before {
  content: "<";
}
</style>
