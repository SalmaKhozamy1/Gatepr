<template>
   <div class="header">
                <div class="container">
                    <div class="flex-between gap-lg position-relative top-header">
                        <img class="main_logo" src="@/assets/images/login_logo.svg" alt="Gatepro_logo">
                        <div class="header-actions flex-start gap-sm">
                            <HeaderItem>
                               <IconsSearch />   
                            </HeaderItem>
                            <HeaderItem class="lang" :badge="locale === 'ar' ? 'E' : 'ع'" @click="toggleLocale">
                                <IconsLang />
                            </HeaderItem>
                            <HeaderItem badge="2">
                                <IconsNotification />
                            </HeaderItem>
                            <HeaderItem name="محمد أحمد" @open-change-password="showChangePassword = true" />
                        </div>
                    </div>
                    <nav class="navbar navbar-expand-lg navbar-dark">
                            <div class="user_info">
                                <h3 class="title nowrap mb-2">مرحبا, محمد </h3>
                                <p class="nowrap">الأربعاء 17 سبتمبر, 2025</p>
                            </div>
                            <button 
                                class="navbar-toggler" 
                                type="button" 
                                @click="isMenuOpen = !isMenuOpen"
                                aria-controls="navbarSupportedContent" 
                                :aria-expanded="isMenuOpen" 
                                aria-label="Toggle navigation"
                            >
                            <span class="navbar-toggler-icon"></span>
                            </button>
                            <div 
                                class="collapse navbar-collapse flex-end" 
                                :class="{ 'show': isMenuOpen }"
                                id="navbarSupportedContent"
                            >
                                <ul class="navbar-nav gap-xs custom-ul">
                                    <li v-for="item in menuItems" :key="item.title" class="nav-item">
                                        <HeaderItem 
                                            :title="item.title" 
                                            :icon="item.icon" 
                                            :active="item.active" 
                                            @click="handleNavClick(item)"
                                        />
                                    </li>
                                </ul>
                            </div>
                    </nav>
                </div>
                <!-- Modals -->
                <ModalsChangePasswordModal v-model:show="showChangePassword" />
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

const { locale, setLocale } = useI18n()

const toggleLocale = () => {
    setLocale(locale.value === 'ar' ? 'en' : 'ar')
}

const isMenuOpen = ref(false);
const showChangePassword = ref(false);
const route = useRoute();

const menuItems = computed(() => [
    { title: 'الرئيسية', icon: IconsHome, path: '/admin/home' },
    { title: 'الإعدادات', icon: IconsSettings, path: '/admin/settings' },
    { title: 'الفروع', icon: IconsBranches, path: '/admin/branches' },
    { title: 'الأصناف', icon: IconsCategories, path: '/admin/categories' },
    { title: 'الموردين', icon: IconsSuppliers, path: '/admin/suppliers' },
    { title: 'سجلات النظام', icon: IconsLogs, path: '/admin/logs' },
].map(item => ({
    ...item,
    active: route.path.startsWith(item.path) || (item.path === '/admin/home' && route.path === '/admin')
})));

const handleNavClick = (item) => {
    if (item.path) {
        navigateTo(item.path);
    }
};
</script>

<style scoped>
.header {
  min-height: 220px;
  height: max-content;
  padding-block: 12px;
  background-color: var(--primary-color);
  color: #fff;
}
.main_logo {
    width: 42px;
}
.navbar {
    padding: 0px;
    margin-top: 25px;
}
.user_info p {
    color: rgba(255, 255, 255, 0.80);
}
.navbar-toggler {
    border-color: transparent;
}
.navbar-toggler:focus {
    box-shadow: none;
}
.navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
}
.nav-item :deep(.header-title) {
    color: rgba(255, 255, 255, 0.70);
}

.nav-item :deep(path) {
    color: rgba(255, 255, 255, 0.70);
}
.top-header {
    z-index: 2;
}
</style>
