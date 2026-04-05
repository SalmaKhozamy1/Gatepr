<template>
  <div class="settings-wrapper position-relative">
    <!-- لو في view page متعرضش الـ PageLayout -->
    <template v-if="isViewPage">
      <NuxtPage />
    </template>

    <template v-else>
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
    </template>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth', adminOnly: true })
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
  { title: 'suppliers_request', icon: IconsSupplierRequest, path: '/suppliers/suppliers_request', addTitle: 'supplier' },
  { title: 'suppliers_update', icon: IconsEditRequest, path: '/suppliers/suppliers_update', addTitle: 'supplier' },
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

const isViewPage = computed(() => !!route.params.id)

onMounted(() => {
  if (route.path === localePath('/suppliers')) {
    navigateTo(localePath('/suppliers/suppliers_request'))
  }
})
</script>

<style scoped>
.form-group {
  width: unset;
  flex: 1;
}
</style>
