<template>
  <div class="notification-wrapper" ref="wrapper">
    <HeaderItem :badge="String(totalCount)" :active="isOpen" @click="isOpen = !isOpen">
      <IconsNotification />
    </HeaderItem>

    <!-- Dropdown -->
    <Transition name="fade">
      <div v-if="isOpen" class="notification-dropdown">
        <!-- Header -->
        <div class="dropdown-header flex-between flex-wrap">
            <div class="title-group flex-column align-end">
                <div class="top-line flex-center gap-sm">
                    <h4 class="notif-title">{{ t('menu.notifications') }}</h4>
                    <InputsFormSelect
                      id="notif-filter"
                      v-model="filterType"
                      :options="filterOptions"
                      :placeholder="t('common.all')"
                      class="notif-filter-select"
                    />
                </div>
            </div>
            <div class="actions">
                <InputsApprove
                  id="mark-all-read"
                  v-model="allRead"
                  :label="t('common.mark_all_read')"
                  class="mark-read-approve"
                  @update:modelValue="onMarkAllRead"
                />
            </div>
        </div>

        <!-- Scrollable List -->
        <div class="notifications-list custom-scrollbar">
            <!-- Loading State -->
            <div v-if="loading" class="notif-empty">
                <span class="loading-text">{{ t('common.loading') || '...' }}</span>
            </div>

            <!-- Empty State -->
            <div v-else-if="(filteredNotifications?.length ?? 0) === 0" class="notif-empty">
                <span>{{ t('common.no_results_found') || 'لا توجد إشعارات' }}</span>
            </div>

            <!-- Notifications List -->
            <div 
              v-else
              v-for="notif in filteredNotifications" 
              :key="notif.id" 
              class="notif-item flex-start align-items-start gap-md" 
              :class="{ 'unread': !notif.read_at }"
              @click="notif.read_at = notif.read_at || new Date().toISOString()"
            >
                <div class="avatar-case">
                    <div class="notif-avatar flex-center">
                        <img src="@/assets/images/login_logo.svg" alt="" class="icon-sm" />
                    </div>
                    <span class="status-dot" :class="notif.read_at ? 'offline' : 'online'"></span>
                </div>

                <div class="notif-content flex-column gap-xs">
                    <h5>{{ notif.title || notif.message || notif.data?.message || '—' }}</h5>
                    <h6 class="gray">{{ notif.created_at }}</h6>
                </div>
            </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { InputsApprove, InputsFormSelect } from '#components'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '~/composables/useNotifications'
import { useAppToast } from '~/composables/useAppToast'

const { t } = useI18n()
const { success: toastSuccess, error: toastError } = useAppToast()
const wrapper = ref(null)
const isOpen = ref(false)

const {
  notifications,
  loading,
  totalCount,
  unreadCount,
  markingAllRead,
  fetchNotifications,
  markAllAsRead,
} = useNotifications()

const filterType = ref('all')

const filterOptions = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('common.read'), value: 'read' },
  { label: t('common.unread'), value: 'unread' },
])

const filteredNotifications = computed(() => {
  const list = notifications.value || []
  if (filterType.value === 'read') return list.filter(n => n.read_at)
  if (filterType.value === 'unread') return list.filter(n => !n.read_at)
  return list
})

const allRead = ref(false)

const onMarkAllRead = async (val) => {
    if (val) {
        try {
            await markAllAsRead()
            toastSuccess(t('messages.updated_successfully', { item: t('menu.notifications') }))
        } catch (err) {
            toastError(err?.data?.message || t('common.somethingWentWrong'))
            allRead.value = false
        }
    }
}

const handleClickOutside = (event) => {
    // Ignore clicks inside PrimeVue select overlays (appended to body)
    if (event.target.closest('.p-select-overlay')) return
    if (wrapper.value && !wrapper.value.contains(event.target)) {
        isOpen.value = false
    }
}

// Fetch notifications when the dropdown opens
watch(isOpen, (val) => {
    if (val) {
        fetchNotifications()
    }
})

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
    // Initial fetch to get badge count
    fetchNotifications()
})

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.notification-wrapper {
  position: relative;
  display: inline-block;
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  inset-inline-end: 0;
  width: 420px;
  background-color: #fff;
  color: var(--text-color);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow: hidden;
  border: 1px solid var(--border-color);
}
:deep(.p-select) {
  border: 0px !important;
  padding: 0px !important;
  min-width: 60px !important;
}
:deep(.p-select-dropdown svg) {
    width: 10px !important;
}
/* Header */
.dropdown-header {
  padding: 16px;
}

.filter-all {
    font-size: 13.5px;
    color: var(--secondary-color);
    font-weight: 500;
    cursor: pointer;
    opacity: 0.9;
}

.mark-read-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
}
.notif-title {
  font-size: 16px;
  color: var(--text-color);
}
.yellow-link {
  color: #D4AF37; /* Gold/Yellowish */
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.mark-read-btn:hover {
  filter: brightness(1.2);
}

/* List */
.notifications-list {
  max-height: 500px;
  overflow-y: auto;
}

.notif-item {
  padding: 16px;
  border-bottom: 1px solid var(--light-gray);
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: right;
  direction: rtl;
}

.notif-item:hover {
  background-color: #F3F4F6;
}

.notif-item.unread {
  background-color: rgba(212, 175, 55, 0.04);
}

/* Avatar */
.avatar-case {
  position: relative;
  min-width: 35px;
  width: 35px;
  height: 35px;
}

.notif-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: var(--white);
  border: 1px solid var(--border-color);
}

.status-dot {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-dot.online {
  background-color: var(--success-color);
}
.status-dot.offline {
  background-color: var(--red);
}
/* Content */
.notif-content {
    flex-grow: 1;
}

.timestamp {
  font-size: 12px;
  color: var(--placeholder);
  font-weight: 500;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 576px) {
  .notification-dropdown {
    position: fixed;
    top: 65px;
    left: 10px;
    right: 10px;
    width: auto;
    margin: 0;
    max-height: calc(100vh - 100px);
  }
}

.icon-sm {
    width: 22px;
    height: 22px;
}
.chevron-sm {
    width: 13px;
    height: 13px;
}

:deep(.approve-checkbox) {
  align-items: center !important;
  gap: var(--gap-xs) !important;
}
.mark-read-approve :deep(.approve-label) {
  color: #D4AF37;
}

.mark-read-approve :deep(.checkmark) {
  width: 16px;
  height: 16px;
  min-width: 16px;
  border-radius: 50%;
  border: 2px solid #D4AF37;
}

.mark-read-approve :deep(.checkmark::after) {
  width: 5px;
  height: 8px;
}
.notif-empty {
    padding: 16px;
    text-align: center;
    color: var(--red);
}
</style>