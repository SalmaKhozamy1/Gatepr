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
    :formTitle="`سجل ${activeTabTitle}`"
    @item-click="handleTabClick">
      
    <template #header-actions>
      <button class="custom-btn primary-btn min-btn-width fltr_btn py-2">
        <span style="font-size: 20px">+</span>
        <span class="ms-1">إضافة {{ activeTabAddTitle }}</span>
      </button>
    </template>
      
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

const route = useRoute()

const settingsMenu = [
  { title: 'المحافظات', icon: IconsGovernorates, path: '/admin/settings/governorates', addTitle: 'محافظة' },
  { title: 'المناطق', icon: IconsSettingsRegions, path: '/admin/settings/regions', addTitle: 'منطقة' },
  { title: 'المستخدمين', icon: IconsSettingsUsers, path: '/admin/settings/users', addTitle: 'مستخدم' },
  { title: 'الأدوار', icon: IconsSettingsRoles, path: '/admin/settings/roles', addTitle: 'دور' },
  { title: 'أنواع الموردين', icon: IconsSuppliers, path: '/admin/settings/supplier-types', addTitle: 'نوع مورد' },
  { title: 'التصنيفات', icon: IconsCategories, path: '/admin/settings/categories', addTitle: 'تصنيف' },
  { title: 'وحدات الشراء', icon: IconsUnits, path: '/admin/settings/purchase-units', addTitle: 'وحدة شراء' },
  { title: 'أنواع الإستلام', icon: IconsReceiveType, path: '/admin/settings/reception-types', addTitle: 'نوع استلام' },
  { title: 'الشروط والأحكام', icon: IconsTerms, path: '/admin/settings/terms', addTitle: 'شرط' },
]

const activeIndex = computed(() => {
  const index = settingsMenu.findIndex(item => item.path === route.path)
  return index !== -1 ? index : 0
})

const activeTabTitle = computed(() => settingsMenu[activeIndex.value]?.title || 'الإعدادات')
const activeTabAddTitle = computed(() => settingsMenu[activeIndex.value]?.addTitle || 'عنصر')

const handleTabClick = (index) => {
  const item = settingsMenu[index]
  if (item) {
    navigateTo(item.path)
  }
}

onMounted(() => {
  navigateTo('/admin/settings/governorates')
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
