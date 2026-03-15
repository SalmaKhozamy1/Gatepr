<template>
  <div class="settings-wrapper">
    <PageLayout
      :asideTitle="t('menu.categories')"
      :asideItems="settingsMenu"
      :activeIndex="activeIndex"
      :formTitle="t('settings.record') + ' ' + activeTabTitle"
      @item-click="handleTabClick"
    >
      <template #search>
        <div id="search-teleport-target" class="w-100"></div>
      </template>

      <template #header-actions>
        <button 
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
  IconsDependance,
  IconsApprovalCategory,
  IconsTerms
} from '#components'

import { provide, ref, computed, onMounted} from 'vue'
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

const handleAddClick = () => {
  addModalOpener.value?.()
}

const settingsMenuItems = [
  { title: 'category_requests', icon: IconsTerms, path: '/categories/categories_required', addTitle: 'category' },
  { title: 'accreditation', icon: IconsDependance, path: '/categories/accredited', addTitle: 'category' },
  { title: 'approved_categories', icon: IconsApprovalCategory, path: '/categories/approved_items', addTitle: 'category' }
]

const settingsMenu = computed(() => settingsMenuItems.map(item => ({
  ...item,
  title: t('menu.' + item.title)
})))

const activeIndex = computed(() => {
  const index = settingsMenuItems.findIndex(item => localePath(item.path) === route.path)
  return index !== -1 ? index : 0
})

const activeTabTitle = computed(() => settingsMenu.value[activeIndex.value]?.title || t('menu.categories'))
const activeTabAddTitle = computed(() => {
  const key = settingsMenuItems[activeIndex.value]?.addTitle
  return key ? t('settings.' + key) : ''
})

const handleTabClick = (index) => {
  const item = settingsMenuItems[index]
  if (item) navigateTo(localePath(item.path))
}

onMounted(() => {
   if (route.path === localePath('/categories')) {
     navigateTo(localePath('/categories/categories_required'))
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
