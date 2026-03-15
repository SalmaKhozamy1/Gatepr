<template>
  <div class="settings-wrapper">
    <PageLayout
      :asideTitle="t('menu.suppliers')"
      :asideItems="suppliersMenu"
      :activeIndex="activeIndex"
      :formTitle="t('settings.record') + ' ' + activeTabTitle"
      @item-click="handleTabClick"
    >
      <template #search>
        <div id="search-teleport-target" class="w-100"></div>
      </template>

      <template #main>
        <NuxtPage />
      </template>
    </PageLayout>
  </div>
</template>

<script setup>
import { 
  IconsSuppliers,
  IconsSupplierRequest,
  IconsEditRequest
} from '#components'

import { provide, ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// ✅ provide للـ register والـ unregister
const addModalOpener = ref(null)

provide('registerAddModal', (fn) => {
  addModalOpener.value = fn
})

provide('unregisterAddModal', () => {
  addModalOpener.value = null
})

const suppliersMenuItems = [
  { title: 'supplier_registration_requests', icon: IconsSupplierRequest, path: '/suppliers/suppliers_request', addTitle: 'supplier' },
  { title: 'data_edit_requests', icon: IconsEditRequest, path: '/suppliers/suppliers_edit', addTitle: 'supplier' },
  { title: 'suppliers', icon: IconsSuppliers, path: '/suppliers/suppliers', addTitle: 'supplier' }
]

const suppliersMenu = computed(() => suppliersMenuItems.map(item => ({
  ...item,
  title: t('menu.' + item.title)
})))

const activeIndex = computed(() => {
  const index = suppliersMenuItems.findIndex(item => localePath(item.path) === route.path)
  return index !== -1 ? index : 0
})

const activeTabTitle = computed(() => suppliersMenu.value[activeIndex.value]?.title || t('menu.suppliers'))

const handleTabClick = (index) => {
  const item = suppliersMenuItems[index]
  if (item) navigateTo(localePath(item.path))
}

onMounted(() => {
  if (route.path === localePath('/suppliers')) {
    navigateTo(localePath('/suppliers/suppliers_request'))
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

</style>
