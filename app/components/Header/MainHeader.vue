<template>
   <div class="header">
      <div class="container">
         <div class="flex-between gap-lg position-relative top-header">
            <img class="main_logo" src="@/assets/images/login_logo.svg" alt="Gatepro_logo">
            <div class="header-actions flex-start gap-sm">
               <HeaderSearch />
               <HeaderItem class="lang" :badge="locale === 'ar' ? 'ع' : 'E'" @click="toggleLocale">
                  <IconsLang />
               </HeaderItem>
               <HeaderItem badge="2">
                  <IconsNotification />
               </HeaderItem>
               <HeaderItem
                  :name="adminName"
                  @open-change-password="showChangePassword = true"
               />
            </div>
         </div>

         <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="user_info">
               <h3 class="title nowrap mb-2">{{ $t('labels.welcome') }}, {{ adminName }}</h3>
               <p class="nowrap">{{ currentDate }}</p>
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
                  <li v-for="item in menuItems" :key="item.path" class="nav-item">
                     <NuxtLink :to="item.path" class="custom-anc">
                        <HeaderItem
                           :title="item.title"
                           :icon="item.icon"
                           :active="item.active"
                        />
                     </NuxtLink>
                  </li>
               </ul>
            </div>
         </nav>
      </div>

      <!-- Modals -->
       <ModalsChangePasswordModal
         v-model:show="showChangePassword"
         endpoint="/v1/admin/forgot-password"
         @open-otp="openOtp"
      />
      <ModalsOtpModal 
         v-model:show="showOtpModal" 
         :contact="resetContact" 
         :type="contactType" 
         verifyEndpoint="/v1/admin/verify-code"
         resendEndpoint="/v1/admin/resend-code"
         @open-reset-password="openResetPassword"
      />
      <ModalsResetPasswordModal 
         v-model:show="showResetPasswordModal" 
         :contact="resetContact"
         :type="contactType"
         :code="resetCode"
         :token="resetToken"
         resetEndpoint="/v1/admin/reset-password"
      />
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
const { changeLocale } = useLocale()

const isMenuOpen = ref(false)
const showChangePassword = ref(false)
const showOtpModal = ref(false)
const showResetPasswordModal = ref(false)
const resetContact = ref('')
const contactType = ref('email')
const resetCode = ref('')
const resetToken = ref('')
const route = useRoute()
const role = useCookie('role')

/* =============================
   USER INFO
============================== */
const userCookie = useCookie('user')
const adminInfo = computed(() => userCookie.value || {})

const adminName = computed(() =>
   adminInfo.value?.name?.[locale.value] ||
   adminInfo.value?.name?.ar ||
   adminInfo.value?.LocalizedName ||
   t('labels.admin')
)

/* =============================
   LOCALE
============================== */
const toggleLocale = async () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  await changeLocale(newLocale)
}

/* =============================
   DATE
============================== */
const currentDate = computed(() => new Intl.DateTimeFormat(
   locale.value === 'ar' ? 'ar-EG' : 'en-US',
   { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
).format(new Date()))

/* =============================
   MENU
============================== */
const menuItems = computed(() => {
   let items = []
   if (role.value === 'supplier') {
      items = [
         { title: t('menu.home'), icon: IconsHome, path: localePath('/home') },
         { title: t('menu.items-management'), icon: IconsCategories, path: localePath('/item-managment') },
         { title: t('settings.terms_and_conditions'), icon: IconsSettings, path: localePath('/terms-and-condition') },
      ]
   } else {
      items = [
         { title: t('menu.home'), icon: IconsHome, path: localePath('/') },
         { title: t('menu.settings'), icon: IconsSettings, path: localePath('/settings') },
         { title: t('menu.branches'), icon: IconsBranches, path: localePath('/branches') },
         { title: t('menu.categories'), icon: IconsCategories, path: localePath('/categories') },
         { title: t('menu.suppliers'), icon: IconsSuppliers, path: localePath('/suppliers') },
         { title: t('menu.logs'), icon: IconsLogs, path: localePath('/activity_logs') },
      ]
   }
   
   return items.map(item => ({
      ...item,
      active: route.path === item.path || route.path.startsWith(item.path + '/')
   }))
})


/* =============================
   MODALS
============================== */
const openOtp = (data) => {
   resetContact.value = data?.value || data  // fallback code
   contactType.value = data?.type || 'email'
   showOtpModal.value = true
}

const openResetPassword = (data) => {
   resetContact.value = data.contact
   contactType.value = data.type
   resetCode.value = data.code
   resetToken.value = data.token || ''
   showResetPasswordModal.value = true
}
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

.top-header {
   z-index: 10;
}
</style>








