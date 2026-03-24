
<template>
  <div ref="searchContainer" class="flex-start">
    <HeaderItem :class="{ 'expanded-search': isSearchOpen }" @click="isSearchOpen = true" class="search-item">
      <IconsSearch @click="toggleSearch" />
      <Transition name="expand">
        <div v-show="isSearchOpen" class="search-input-wrapper">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="t('common.search')"
            @click.stop
            @keydown.down.prevent="onArrowDown"
            @keydown.up.prevent="onArrowUp"
            @keyup.enter="handleSearch"
          />
          
          <!-- Search Popover -->
          <div v-if="searchQuery.trim()" class="search-popover custom-shadow">
            <div class="search-section">
              <div v-if="filteredResults.length">
                <div 
                  v-for="(res, idx) in filteredResults" 
                  :key="idx" 
                  class="search-result-item"
                  :class="{ 'active': highlightedIndex === idx }"
                  @click="handleSelectResult(res)"
                  @mouseenter="highlightedIndex = idx"
                >
                  <component :is="res.icon" v-if="res.icon" class="res-icon" />
                  <span>{{ res.title }}</span>
                </div>
              </div>
              <div v-else class="no-results p-3 text-center">
                <p class="gray text-sm">{{ t('common.no_results_found') }}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </HeaderItem>
  </div>
</template>

<script setup>
import {
   IconsHome,
   IconsSettings,
   IconsBranches,
   IconsCategories,
   IconsSuppliers,
   IconsLogs
} from '#components'

const { locale, t } = useI18n()
const localePath = useLocalePath()

// Global State
const searchQuery = useState('searchQuery', () => '')
const searchHistory = useState('searchHistory', () => [])

const isSearchOpen = ref(false)
const searchInput = ref(null)
const searchContainer = ref(null)
const highlightedIndex = ref(-1)

const toggleSearch = () => {
   isSearchOpen.value = !isSearchOpen.value
   if (isSearchOpen.value) {
      nextTick(() => {
         searchInput.value?.focus()
      })
   } else {
      searchQuery.value = ''
   }
}

const allSearchableItems = computed(() => {
   const baseLinks = [
      { title: t('menu.home'), icon: IconsHome, path: localePath('/admin/home') },
      { title: t('menu.settings'), icon: IconsSettings, path: localePath('/settings') },
      { title: t('menu.branches'), icon: IconsBranches, path: localePath('/branches') },
      { title: t('menu.categories'), icon: IconsCategories, path: localePath('/categories') },
      { title: t('menu.suppliers'), icon: IconsSuppliers, path: localePath('/suppliers') },
      { title: t('menu.logs'), icon: IconsLogs, path: localePath('/activity_logs') },
   ]

   const subSettings = [
      { title: t('settings.governorates'), icon: IconsSettings, path: localePath('/settings/governorates') },
      { title: t('settings.areas'), icon: IconsSettings, path: localePath('/settings/areas') },
      { title: t('settings.users'), icon: IconsSettings, path: localePath('/settings/users') },
      { title: t('settings.roles'), icon: IconsSettings, path: localePath('/settings/roles') },
      { title: t('settings.supplier_types'), icon: IconsSettings, path: localePath('/settings/supplier-types') },
      { title: t('settings.categories'), icon: IconsSettings, path: localePath('/settings/categories') },
      { title: t('settings.purchasing_units'), icon: IconsSettings, path: localePath('/settings/purchasing-units') },
      { title: t('settings.receipt_types'), icon: IconsSettings, path: localePath('/settings/receipt-types') },
      { title: t('settings.terms_and_conditions'), icon: IconsSettings, path: localePath('/settings/terms') },
   ]  

   return [...baseLinks, ...subSettings]
})

const filteredResults = computed(() => {
   const query = searchQuery.value?.trim().toLowerCase()
   if (!query) return []
   return allSearchableItems.value.filter(item => 
      item.title?.toLowerCase().includes(query)
   )
})

const onArrowDown = () => {
   if (filteredResults.value.length === 0) return
   if (highlightedIndex.value < filteredResults.value.length - 1) {
      highlightedIndex.value++
   } else {
      highlightedIndex.value = 0
   }
}

const onArrowUp = () => {
   if (filteredResults.value.length === 0) return
   if (highlightedIndex.value > 0) {
      highlightedIndex.value--
   } else {
      highlightedIndex.value = filteredResults.value.length - 1
   }
}

watch(searchQuery, () => {
   highlightedIndex.value = -1
})

const addToHistory = (query) => {
    const trimmed = query.trim()
    if (!trimmed) return
    const updatedHistory = [trimmed, ...searchHistory.value.filter(h => h !== trimmed)].slice(0, 10)
    searchHistory.value = updatedHistory
}

const handleSelectResult = (item) => {
   addToHistory(searchQuery.value)
   isSearchOpen.value = false
   searchQuery.value = ''
   navigateTo(item.path)
}

const handleSearch = () => {
   if (highlightedIndex.value >= 0 && filteredResults.value[highlightedIndex.value]) {
       handleSelectResult(filteredResults.value[highlightedIndex.value])
   } else if (filteredResults.value.length > 0) {
      handleSelectResult(filteredResults.value[0])
   }
}

const handleClickOutside = (event) => {
   if (searchContainer.value && !searchContainer.value.contains(event.target)) {
      if (!searchQuery.value?.trim()) {
         isSearchOpen.value = false
      }
   }
}

onMounted(() => {
   window.addEventListener('click', handleClickOutside)
   // Load history from localStorage
   const storedHistory = localStorage.getItem('nav_search_history')
   if (storedHistory) {
      try { searchHistory.value = JSON.parse(storedHistory) } catch (e) {}
   }
})

onUnmounted(() => {
   window.removeEventListener('click', handleClickOutside)
})

watch(searchHistory, (newHistory) => {
   localStorage.setItem('nav_search_history', JSON.stringify(newHistory))
}, { deep: true })

</script>

<style scoped>
/* Expanded Search Styles */
.expanded-search {
   min-width: 250px !important;
   justify-content: flex-start !important;
   padding-inline: 12px !important;
   background: rgba(255, 255, 255, 0.1) !important;
}

.search-input {
   background: transparent;
   border: none;
   color: #fff;
   width: 100%;
   outline: none;
   font-size: var(--size-sm);
}

.search-input::placeholder {
   color: rgba(255, 255, 255, 0.5) !important;
}

/* Transition */
.expand-enter-active,
.expand-leave-active {
   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-enter-from,
.expand-leave-to {
   width: 0 !important;
   opacity: 0;
   transform: translateX(10px);
}

.search-item {
   position: relative;
}

.search-input-wrapper {
   width: 100%;
}

.search-popover {
   position: absolute;
   top: 50px;
   inset-inline-start: 50%;
   transform: translateX(-50%);
   width: 101%;
   background: var(--primary-color);
   backdrop-filter: blur(16px);
   border: 1px solid rgba(255, 255, 255, 0.1);
   border-radius: var(--radius-sm);
   z-index: 1000;
   color: #fff;
   padding: 8px;
   max-height: 400px;
   overflow-y: auto;
   display: flex;
   flex-direction: column;
}

.search-result-item {
   display: flex;
   align-items: center;
   gap: 10px;
   padding: 10px 12px;
   border-radius: var(--radius-sm);
   cursor: pointer;
   transition: all 0.2s;
   color: rgba(255, 255, 255, 0.8);
   font-weight: 400;
   font-size: 13px;
}

.search-result-item:hover,
.search-result-item.active {
   background-color: rgba(255, 255, 255, 0.05);
   color: #fff;
}

.res-icon {
   width: 18px;
   height: 18px;
}

.custom-shadow {
   box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03);
}

.no-results p {
   font-size: 14px;
   color: var(--red);
}
</style>
