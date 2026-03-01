<template>
    <div>
        <div class="default-wrapper">
            <div class="header">
                <div class="container">
                    <div class="flex-between gap-lg">
                        <img class="main_logo" src="../assets/images/login_logo.svg" alt="Gatepro_logo">
                        <div class="header-actions flex-start gap-sm">
                            <HeaderItem>
                               <IconsSearch />   
                            </HeaderItem>
                            <HeaderItem badge="ع">
                               <IconsLang />
                            </HeaderItem>
                            <HeaderItem badge="2">
                                <IconsNotification />
                            </HeaderItem>
                            <HeaderItem name="محمد أحمد" />
                        </div>
                    </div>
                    <nav class="navbar navbar-expand-lg">
                            <div class="user_info">
                                <h3 class="title nowrap">مرحبا, محمد </h3>
                                <p class="desc nowrap">الأربعاء 17 سبتمبر, 2025</p>
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
                                <ul class="navbar-nav gap-xs">
                                    <li class="nav-item">
                                        <HeaderItem active>
                                            <IconsHome />
                                            <span class="nowrap">الرئيسية</span>
                                        </HeaderItem>
                                    </li>
                                    <li class="nav-item">
                                        <HeaderItem>
                                            <span class="nowrap">الإعدادات</span>
                                            <IconsSettings />
                                        </HeaderItem>
                                    </li>
                                    <li class="nav-item">
                                        <HeaderItem>
                                            <span class="nowrap">الفروع</span>
                                            <IconsBranches />
                                        </HeaderItem>
                                    </li>
                                    <li class="nav-item">
                                        <HeaderItem>
                                            <span class="nowrap">الأصناف</span>
                                            <IconsCategories />
                                        </HeaderItem>
                                    </li>
                                    <li class="nav-item">
                                        <HeaderItem>
                                            <span class="nowrap">الموردين</span>
                                            <IconsSuppliers />
                                        </HeaderItem>
                                    </li>
                                    <li class="nav-item">
                                        <HeaderItem>
                                            <span class="nowrap">سجلات النظام</span>
                                            <IconsLogs />
                                        </HeaderItem>
                                    </li>
                                </ul>
                            </div>
                    </nav>
                </div>
            </div>
            <div class="content container">
               <CardsCustomCard title="نظرة عامة">
                  <div class="grid grid-3">
                        <cardsStatisticsCard CardNo="56" title="عدد الفروع" />
                        <cardsStatisticsCard CardNo="20" title="طلبات التسجيل قيد الإنتظار" />
                        <cardsStatisticsCard CardNo="50" title="الموردين المقبولين" />
                        <cardsStatisticsCard CardNo="30" title="طلبات الأصناف قيد الإنتظار" />
                        <cardsStatisticsCard CardNo="54336" title="طلبات الأصناف المقبولة" />
                        <cardsStatisticsCard CardNo="15533" title="عدد الأصناف" />
                  </div>
               </CardsCustomCard>
               <div class="mt-4">
                 <slot />
               </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header {
  min-height: 220px;
  height: max-content;
  padding-block: 12px;
  background-color: var(--primary-color);
  color: #fff;
}
.content {
    position: relative;
    top: -56px;
}
.main_logo {
    width: 42px;
}
.navbar {
    padding: 0px;
    margin-top: 25px;
}
</style>

<script setup>
  const isMenuOpen = ref(false);
</script>