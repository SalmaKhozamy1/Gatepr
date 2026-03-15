<template>
  <div 
    class="header-box flex-center" 
    :class="{ 'active': active, 'has-dropdown': name }"
    @click.stop="toggleDropdown"
    ref="dropdownRef"
  >
    <!-- Profile Mode -->
    <template v-if="name">
        <div class="flex-between gap-sm w-100">
            <div class="profile-info">
                <p class="username">{{ name }}</p>
            </div>
            <div class="dropdown-arrow flex-center" :class="{ 'open': isDropdownOpen }">
                <IconsDownArrow />
            </div>
        </div>

        <!-- Dropdown Menu -->
        <div v-if="isDropdownOpen" class="profile-dropdown">
            <!-- Dropdown Header -->
            <div class="dropdown-header">
                <h5 class="user-full-name mb-1">{{ name }}</h5>
                <h6 class="desc">{{ t('labels.admin') }}</h6>
            </div>

            <!-- List Items -->
            <ul class="dropdown-list custom-ul">
            <li class="dropdown-item" @click.stop="openChangePassword">
                <IconsLock />
                <h5 class="item-text">{{ t('profile.change_password') }}</h5>
            </li>
            <li class="dropdown-item logout" @click="logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12.5996 2.25C13.1092 2.25 13.611 2.28437 14.1016 2.35156C14.5119 2.40778 14.7994 2.78688 14.7432 3.19727C14.6867 3.60735 14.3086 3.89397 13.8984 3.83789C13.4751 3.7799 13.041 3.75 12.5996 3.75C7.66574 3.7502 3.75 7.48863 3.75 12C3.75 16.5114 7.66574 20.2498 12.5996 20.25C13.041 20.25 13.4751 20.2201 13.8984 20.1621C14.3086 20.106 14.6867 20.3927 14.7432 20.8027C14.7994 21.2131 14.5119 21.5922 14.1016 21.6484C13.611 21.7156 13.1092 21.75 12.5996 21.75C6.92997 21.7498 2.25 17.4295 2.25 12C2.25 6.57049 6.92997 2.2502 12.5996 2.25ZM17.9619 8.97754C18.2505 8.68061 18.7254 8.67349 19.0225 8.96191C19.1137 9.05062 19.296 9.19696 19.5674 9.41016C19.5869 9.42552 19.6068 9.4412 19.627 9.45703C19.8691 9.6471 20.1537 9.86988 20.4248 10.0996C20.7151 10.3456 21.0165 10.6212 21.251 10.8965C21.3684 11.0344 21.4847 11.1902 21.5742 11.3574C21.6606 11.5189 21.75 11.7417 21.75 12C21.75 12.2583 21.6606 12.4811 21.5742 12.6426C21.4847 12.8098 21.3684 12.9656 21.251 13.1035C21.0165 13.3788 20.7151 13.6544 20.4248 13.9004C20.1537 14.1301 19.8691 14.3529 19.627 14.543C19.6068 14.5588 19.5869 14.5745 19.5674 14.5898C19.296 14.803 19.1137 14.9494 19.0225 15.0381C18.7254 15.3265 18.2505 15.3194 17.9619 15.0225C17.6735 14.7254 17.6806 14.2505 17.9775 13.9619C18.1391 13.8049 18.3961 13.6032 18.6406 13.4111C18.6594 13.3964 18.6783 13.3811 18.6973 13.3662C18.943 13.1733 19.2064 12.9665 19.4551 12.7559C19.4574 12.7539 19.4596 12.7519 19.4619 12.75H11C10.5858 12.75 10.25 12.4142 10.25 12C10.25 11.5858 10.5858 11.25 11 11.25H19.4619C19.4596 11.2481 19.4574 11.2461 19.4551 11.2441C19.2064 11.0335 18.943 10.8267 18.6973 10.6338C18.6783 10.6189 18.6594 10.6036 18.6406 10.5889C18.3961 10.3968 18.1391 10.1951 17.9775 10.0381C17.6806 9.74948 17.6735 9.27458 17.9619 8.97754Z" fill="#8F92A1"/>
                </svg>
                <h5 class="item-text">{{ t('profile.logout') }}</h5>
            </li>
            </ul>

        </div>
    </template>

    <!-- Action / Nav Mode -->
    <template v-else>
      <div class="flex-center gap-xs header-item">
          <component :is="icon" v-if="icon" />
          
          <h5 v-if="title" class="nowrap header-title">
              {{ title }}
          </h5>
          
          <slot v-else /> 
      </div>
      <span v-if="badge" class="header-badge flex-center">
        {{ badge }}
      </span>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from 'vue-i18n'  // ✅

const { logout } = useAuth()
const { t } = useI18n() 

const props = defineProps({
  name: { type: String, default: null },
  badge: { type: [String, Number], default: null },
  active: { type: Boolean, default: false },
  title: { type: String, default: null }, 
  icon: { type: [Object, Function, String], default: null } 
})

const emit = defineEmits(['open-change-password'])

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
}

const openChangePassword = () => {
    isDropdownOpen.value = false
    emit('open-change-password')
}

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isDropdownOpen.value = false
    }
}

onMounted(() => {
    window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside)
})

</script>

<style scoped>
.header-box {
    border-radius: var(--radius-sm);
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(249, 249, 250, 0.05);
    backdrop-filter: blur(16.350000381469727px);
    padding: 8px;
    min-width: 48px;
    min-height: 48px;
    color: rgba(255, 255, 255, 0.70);
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
}

.header-box:hover {
    background-color: color-mix(in srgb, var(--light-primary-color), transparent 85%);;
}
.header-box.active {
    background-color: var(--secondary-color);
    color: #fff;
}
.dropdown-arrow {
    transition: transform 0.3s ease;
}
.dropdown-arrow.open {
    transform: rotate(180deg);
}

/* Dropdown Styles */
.profile-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    inset-inline-end: 0;
    width: 240px;
    background: #fff;
    border-radius: var(--radius-md);
    box-shadow: 0px 10px 15px -10px rgba(16, 24, 40, 0.1), 0px 4px 6px -4px rgba(16, 24, 40, 0.05);
    color: var(--text-color);
    z-index: 1000;
    overflow: hidden;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.dropdown-header {
    background-color: var(--light-primary-color);
    padding: 8px;
    text-align: start;
    border-radius: var(--radius-sm);
}
.dropdown-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.dropdown-item {
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s;
    cursor: pointer;
    color: #475569;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
}
.dropdown-item:hover {
    background-color:var(--light-primary-color);
    color: var(--primary-color);
}
.has-dropdown {
    min-width: 100px;
}
.item-text {
  color: var(--gray-color);
}
.dropdown-item svg {
    width: 18px;
    height: 18px;
}
.dropdown-item.logout:hover {
   background-color: color-mix(in srgb, var(--red) 4%, transparent 3%);
}
.dropdown-item.logout:hover .item-text {
    color: var(--red);
}
.dropdown-item.logout:hover path {
    fill: var(--red);
}

.header-badge {
    position: absolute;
    top: 5px;
    inset-inline-start: 4px;
    background-color: var(--secondary-color);
    color: #fff;
    font-size: var(--size-xs);
    font-weight: 500;
    min-width: 20px;
    height: 20px;
    border-radius: 50%;
}
.username {
    white-space: nowrap;
}

</style>
