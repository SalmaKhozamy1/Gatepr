<template>
  <div class="settings-wrapper">
    <!-- Page Header (Overlays the dark header area) -->
    <!-- <div class="page-top-section mb-4">
      <div class="flex-between align-items-end">
        <div class="title-bread">
          <h2 class="page-title text-white fw-bold mb-2">الإعدادات</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item"><NuxtLink to="/admin/home">الرئيسية</NuxtLink></li>
              <li class="breadcrumb-item"><NuxtLink to="/admin/settings">الإعدادات</NuxtLink></li>
              <li class="breadcrumb-item active" aria-current="page">{{ activeTabTitle }}</li>
            </ol>
          </nav>
        </div>
      </div>
    </div> -->

    <PageLayout
    asideTitle="الإعدادات"
    :asideItems="settingsMenu"
    :activeIndex="activeIndex"
    formTitle="فلتر البحث"
    @item-click="handleTabClick">
      
    <template #search>
        <div class="flex-start gap-sm w-100">
            <InputsFormInput 
              v-model="searchQuery"
              placeholder="بحث .." 
              class="flex-grow-1"
            />
            <button class="custom-btn primary-btn px-4" @click="handleFilter">
              <IconsSearch />
              <span>بحث</span>
            </button>
            <button class="custom-btn text-btn nowrap" @click="resetFilters">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 4v6h-6"></path>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>مسح الكل</span>
            </button>
          </div>
    </template>
    <template #main>
      {{ activeItem }}
    </template>
    </PageLayout>

  </div>
</template>

<script setup>
import { 
  IconsSettingsGovernorates,
  IconsSettingsRegions,
  IconsSettingsUsers,
  IconsSettingsRoles,
  IconsCategories
} from '#components'

const route = useRoute()

const settingsMenu = [
  { title: 'المحافظات', icon: IconsSettingsGovernorates, path: '/admin/settings/governorates' },
  { title: 'المناطق', icon: IconsSettingsRegions, path: '/admin/settings/regions' },
  { title: 'المستخدمين', icon: IconsSettingsUsers, path: '/admin/settings/users' },
  { title: 'الأدوار', icon: IconsSettingsRoles, path: '/admin/settings/roles' },
  { title: 'أنواع الموردين', icon: IconsSettingsUsers, path: '/admin/settings/supplier-types' },
  { title: 'التصنيفات', icon: IconsCategories, path: '/admin/settings/categories' },
  { title: 'وحدات الشراء', icon: IconsSettingsGovernorates, path: '/admin/settings/purchase-units' },
  { title: 'أنواع الإستلام', icon: IconsSettingsGovernorates, path: '/admin/settings/reception-types' },
  { title: 'الشروط والأحكام', icon: IconsSettingsGovernorates, path: '/admin/settings/terms' },
]

const activeIndex = computed(() => {
  const index = settingsMenu.findIndex(item => item.path === route.path)
  return index !== -1 ? index : 0
})

const activeTabTitle = computed(() => settingsMenu[activeIndex.value]?.title || 'الإعدادات')

const handleTabClick = (index) => {
  const item = settingsMenu[index]
  if (item) {
    navigateTo(item.path)
  }
}
</script>

<style scoped>
.settings-wrapper {
  position: relative;
}

.page-title {
  font-size: 28px;
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
