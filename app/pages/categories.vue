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
        <!-- Tab 0 & 1: Pending & Accredited Requests -->
        <div v-if="activeIndex === 0 || activeIndex === 1" class="flex-start gap-sm">
          <button 
            class="custom-btn danger-btn min-btn-width fltr_btn"
            @click="handlePageAction('rejectAll')"
          >
            <IconsCross width="18" height="18" />
            <span>{{ t('buttons.reject_all') }}</span>
          </button>
          <button 
            class="custom-btn success-btn min-btn-width fltr_btn"
            @click="handlePageAction('acceptAll')"
          >
            <IconsCheck width="18" height="18" />
            <span>{{ t('buttons.accept_all') }}</span>
          </button>
        </div>

        <!-- Tab 2: Approved Categories -->
        <div v-else-if="activeIndex === 2" class="flex-start gap-sm">
          <button 
            class="custom-btn gray-btn  fltr_btn"
            @click="handlePageAction('download')"
          >
            <IconsDownload width="18" height="18" />
            <span>{{ t('buttons.download') }}</span>
          </button>
        </div>
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
  IconsTerms,
  IconsCheck,
  IconsCross,
  IconsExport
} from '#components'

import { provide, ref, computed, onMounted} from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// provide logic for dynamic actions
const addModalOpener = ref(null)
const pageActions = ref({})

provide('registerAddModal', (fn) => {
  addModalOpener.value = fn
})

provide('unregisterAddModal', () => {
  addModalOpener.value = null
})

provide('registerPageAction', (actionName, fn) => {
  pageActions.value[actionName] = fn
})

provide('unregisterPageAction', (actionName) => {
  delete pageActions.value[actionName]
})

const handleAddClick = () => {
  addModalOpener.value?.()
}

const handlePageAction = (name) => {
  pageActions.value[name]?.()
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
