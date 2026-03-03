<template>
   <div class="header">
                <div class="container">
                    <div class="flex-between gap-lg">
                        <img class="main_logo" src="@/assets/images/login_logo.svg" alt="Gatepro_logo">
                        <div class="header-actions flex-start gap-sm">
                            <HeaderItem>
                               <IconsSearch />   
                            </HeaderItem>
                            <HeaderItem class="lang" badge="ع">
                               <IconsLang />
                            </HeaderItem>
                            <HeaderItem badge="2">
                                <IconsNotification />
                            </HeaderItem>
                            <HeaderItem name="محمد أحمد" />
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
                                        />
                                    </li>
                                </ul>
                            </div>
                    </nav>
                </div>
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

const isMenuOpen = ref(false);

const menuItems = [
    { title: 'الرئيسية', icon: IconsHome, active: true },
    { title: 'الإعدادات', icon: IconsSettings, active: false },
    { title: 'الفروع', icon: IconsBranches, active: false },
    { title: 'الأصناف', icon: IconsCategories, active: false },
    { title: 'الموردين', icon: IconsSuppliers, active: false },
    { title: 'سجلات النظام', icon: IconsLogs, active: false },
];
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
</style>
