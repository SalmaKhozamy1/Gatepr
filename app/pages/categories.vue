<template>
  <div class="settings-wrapper position-relative">
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
definePageMeta({ middleware: 'auth', adminOnly: true })
import { 
  IconsDependance,
  IconsApprovalCategory,
  IconsTerms,
  IconsCheck,
  IconsCross
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

const handlePageAction = async (name) => {
  if (pageActions.value[name]) {
    pageActions.value[name]()
    return
  }
  // ✅ Accept All
  if (name === 'acceptAll') {
    try {
      actionLoading.value = 'acceptAll'
      await api('/v1/admin/items/approve', { method: 'POST' })
      toastSuccess(t('messages.updated_successfully'))
      // reload الـ child page
      pageActions.value['refresh']?.()
    } catch (err) {
      toastError(err?.data?.message || t('common.somethingWentWrong'))
    } finally {
      actionLoading.value = null
    }
  }

  // ✅ Reject All
  if (name === 'rejectAll') {
    try {
      actionLoading.value = 'rejectAll'
      await api('/v1/admin/items/reject', { method: 'POST' })
      toastSuccess(t('messages.updated_successfully'))
      pageActions.value['refresh']?.()
    } catch (err) {
      toastError(err?.data?.message || t('common.somethingWentWrong'))
    } finally {
      actionLoading.value = null
    }
  }
}

const settingsMenuItems = [
  { title: 'category_requests', icon: IconsTerms, path: '/categories/categories_required', addTitle: 'category' },
  { title: 'accredited', icon: IconsDependance, path: '/categories/accredited', addTitle: 'category' },
  { title: 'approved_items', icon: IconsApprovalCategory, path: '/categories/approved_items', addTitle: 'category' }
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
.form-group {
  width: unset;
  flex: 1;
}
</style>
