<template>
   <div class="header">
      <div class="container">
         <div class="flex-between gap-lg position-relative top-header">
            <img class="main_logo" src="@/assets/images/login_logo.svg" alt="Gatepro_logo">
            <div v-if="!isPublicPage" class="header-actions flex-start gap-sm align-items-stretch">
               <HeaderSearch />
               <HeaderItem class="lang" :badge="locale === 'ar' ? 'ع' : 'E'" @click="toggleLocale">
                  <IconsLang />
               </HeaderItem>
               <HeaderItem badge="2">
                  <IconsNotification />
               </HeaderItem>
               <InputsFormSelect 
                  v-if="role === 'supplier'" 
                  v-model="selectedBranch" 
                  :options="branchOptions" 
                  class="header_Select"
               />
               <HeaderItem
                  :name="adminName"
                  :role="role"
                  :avatar="userAvatar"
                  @open-change-password="showChangePassword = true"
               />

            </div>
         </div>

         <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="user_info">
               <h3 class="title nowrap mb-2">
                 <template v-if="isPublicPage">
                   {{ $t('buttons.signUp') }}
                 </template>
                 <template v-else>
                   {{ $t('labels.welcome') }}, {{ adminName }}
                 </template>
               </h3>
               <p v-if="!isPublicPage" class="nowrap">{{ currentDate }}</p>
            </div>
            <button
               v-if="!isPublicPage"
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
               v-if="!isPublicPage"
               class="collapse navbar-collapse flex-end"
               :class="{ 'show': isMenuOpen }"
               id="navbarSupportedContent"
            >
               <ul class="navbar-nav gap-xs custom-ul">
                  <li v-for="(item, index) in menuItems" :key="index + '-' + item.path" class="nav-item">
                     <NuxtLink :to="item.path" :exact="item.exact" class="custom-anc">
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

const isPublicPage = computed(() => {
  return route.path.includes('/register')
})

/* =============================
   USER INFO
============================== */
const userCookie = useCookie('user')
const adminInfo = computed(() => userCookie.value || {})

const adminName = computed(() => {
   const info = adminInfo.value?.supplier || adminInfo.value
   const nameValue = info?.name
   
   if (typeof nameValue === 'string') return nameValue
   
   return (
      nameValue?.[locale.value] ||
      nameValue?.ar ||
      info?.LocalizedName ||
      t('labels.admin')
   )
})

const userAvatar = computed(() => {
   const info = adminInfo.value?.supplier || adminInfo.value
   return info?.avatar || info?.image
})

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
const normalizePath = (p) => (p || '').replace(/\/$/, '') || '/'

const menuItems = computed(() => {
   const currentPath = normalizePath(route.path)
   let items = []
   if (role.value === 'supplier') {
      items = [
         { title: t('menu.home'), icon: IconsHome, path: localePath('/home') },
         { title: t('menu.items-management'), icon: IconsCategories, path: localePath('/item-managment') },
         { title: t('settings.terms_and_conditions'), icon: IconsSettings, path: localePath('/terms-and-condition') },
      ]
   } else {
      items = [
         { title: t('menu.home'), icon: IconsHome, path: localePath('/home') },
         { title: t('menu.settings'), icon: IconsSettings, path: localePath('/settings') },
         { title: t('menu.branches'), icon: IconsBranches, path: localePath('/branches') },
         { title: t('menu.categories'), icon: IconsCategories, path: localePath('/categories') },
         { title: t('menu.suppliers'), icon: IconsSuppliers, path: localePath('/suppliers') },
         { title: t('menu.logs'), icon: IconsLogs, path: localePath('/activity_logs') },
      ]
   }

   // Detect all variations of the Home/Dashboard route across roles/languages
   const homePaths = [
      '/', '/en', '/ar',
      normalizePath(localePath('/')),
      normalizePath(localePath('/home'))
   ]

   return items.map(item => {
      const itemPath = normalizePath(item.path)
      const isHome = homePaths.includes(itemPath)
      
      // Home uses EXACT matching only
      // Others use prefix matching for sub-pages support
      const isActive = isHome 
         ? currentPath === itemPath 
         : (currentPath === itemPath || currentPath.startsWith(itemPath + '/'))
      
      return {
         ...item,
         active: isActive,
         exact: isHome
      }
   })
})

/* =============================
   MODALS
============================== */
const openOtp = (data) => {
   resetContact.value = data?.value || data
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

/* =============================
   BRANCHES (Supplier)
 ============================== */
const api = useApi()
const branchesCount = ref(0)
const branchesRaw = ref([])
const branchOptions = ref([])
const selectedBranch = useCookie('selected_branch')

const fetchBranches = async () => {
    if (role.value !== 'supplier') return
    try {
        const res = await api('/branches')
        branchesRaw.value = res.data || []
        branchOptions.value = branchesRaw.value.map(b => ({
            label: b.LocalizedName || b.name?.[locale.value] || b.name?.ar || b.name,
            value: b.id
        }))
        
        // Default selection if empty
        if (!selectedBranch.value && branchOptions.value.length) {
            selectedBranch.value = branchOptions.value[0].value
        }
    } catch (err) {
        console.error('Error fetching branches in header:', err)
    }
}

watch(locale, () => {
    if (role.value === 'supplier') {
        branchOptions.value = branchesRaw.value.map(b => ({
            label: b.LocalizedName || b.name?.[locale.value] || b.name?.ar || b.name,
            value: b.id
        }))
    }
})

onMounted(() => fetchBranches())
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
.router-link-active > .header-box{
   background-color: var(--secondary-color);
}

.header_Select :deep(.p-select) {
   min-width: min-content !important;
   border-radius: var(--radius-sm) !important;
   border: 1px solid rgba(255, 255, 255, 0.05) !important;
   background-color: rgba(249, 249, 250, 0.05) !important;
   backdrop-filter: blur(16.350000381469727px) !important;
   height: 100%;
   align-items: center;
}
</style>








