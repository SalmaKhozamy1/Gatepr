
<template>
  <div class="roles-add-page px-3 pb-5">
    <!-- 🟢 Role Name Section -->
    <CardsCustomCard>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="fw-bold mb-0 text-dark-blue">{{ t('settings.add') }} {{ t('labels.role') }}</h5>
      </div>
      
      <div class="row g-4">
        <div class="col-md-6">
          <InputsFormInput
            v-model="roleData.name.ar"
            :label="t('labels.name_ar')"
            :placeholder="t('placeholders.name_ar')"
            required
            :error="errors['name.ar']"
          />
        </div>
        <div class="col-md-6">
          <InputsFormInput
            v-model="roleData.name.en"
            :label="t('labels.name_en')"
            :placeholder="t('placeholders.name_en')"
            required
            :error="errors['name.en']"
          />
        </div>
      </div>

      <div class="d-flex gap-3 justify-content-end mt-4 pt-2">
        <button class="custom-btn text-btn min-btn-width" @click="handleCancel">
          {{ t('buttons.cancel') }}
        </button>
        <button class="custom-btn secondary-btn min-btn-width shadow-sm" :disabled="loading" @click="handleSave">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <span>{{ t('buttons.save') }}</span>
        </button>
      </div>
    </CardsCustomCard>

    <!-- 🟢 Permissions Selection -->
    <div class="permissions-section mt-5">
      <div v-for="(group, groupIndex) in permissionGroups" :key="groupIndex" class="accordion-item shadow-sm mb-3">
        <!-- Accordion Header -->
        <div 
          class="accordion-header d-flex justify-content-between align-items-center" 
          :class="{ 'active': group.expanded }"
          @click="toggleGroup(groupIndex)"
        >
          <!-- Left/Start Side (Icon & Title) -->
          <div class="d-flex align-items-center gap-3">
             <div class="group-icon-box shadow-none">
                <component :is="group.icon || IconsSettings" width="22" height="22" />
              </div>
              <h6 class="group-title mb-0">{{ group.title }}</h6>
          </div>
          
          <!-- Right/End Side (Select All & Arrow) -->
          <div class="d-flex align-items-center gap-4">
            <div class="custom-checkbox-all d-flex align-items-center gap-2" @click.stop>
              <span class="text-muted small">{{ t('labels.select_all') }}</span>
              <input 
                class="form-check-input custom-check" 
                type="checkbox" 
                :id="'check-all-' + groupIndex"
                v-model="group.allSelected"
                @change="toggleAllInGroup(group)"
              >
            </div>
            <div class="arrow-indicator" :class="{ 'active': group.expanded }">
              <IconsDownArrow width="14" height="14" />
            </div>
          </div>
        </div>

        <!-- Accordion Body -->
        <Transition name="accordion-slide">
          <div v-if="group.expanded" class="accordion-body bg-white">
            <div class="permissions-grid d-flex flex-wrap gap-4">
              <div v-for="permission in group.permissions" :key="permission.id" class="permission-item">
                <div class="form-check d-flex align-items-center gap-2">
                  <input 
                    class="form-check-input custom-check" 
                    type="checkbox" 
                    :id="'perm-' + permission.id"
                    v-model="selectedPermissions"
                    :value="permission.id"
                    @change="updateGroupAllSelected(group)"
                  >
                  <label class="form-check-label text-dark fs-14 fw-medium mb-0" :for="'perm-' + permission.id">
                    {{ permission.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- 🟢 Bottom Sticky Actions (Optional) -->
    <div class="bottom-actions mt-5 d-flex gap-3 justify-content-end">
        <button class="custom-btn text-btn min-btn-width" @click="handleCancel">
          {{ t('buttons.cancel') }}
        </button>
        <button class="custom-btn secondary-btn min-btn-width shadow-sm" :disabled="loading" @click="handleSave">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <span>{{ t('buttons.save') }}</span>
        </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'
import { 
  IconsSettings, 
  IconsDownArrow,
  IconsGovernorates,
  IconsSettingsRegions,
  IconsSettingsUsers,
  IconsSettingsRoles,
  IconsCategories,
  IconsSuppliers,
  IconsUnits,
  IconsReceiveType,
  IconsTerms,
  IconsBranches,
  IconsLogs,
  IconsNotification
} from '#components'

const api = useApi()
const { success, error: toastError } = useAppToast()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const loading = ref(false)
const errors = ref({})
const selectedPermissions = ref([])

const roleData = reactive({
  name: {
    ar: '',
    en: ''
  }
})

// Icon Map for Permissions Categories
const iconMap = {
  'المدن': IconsGovernorates,
  'مناطق': IconsSettingsRegions,
  'مستخدمين': IconsSettingsUsers,
  'الأدوار': IconsSettingsRoles,
  'وحدات الشراء': IconsUnits,
  'التصنيفات الفرعية': IconsCategories,
  'إدارة التصنيفات': IconsCategories,
  'أنواع الموردين': IconsSuppliers,
  'الموردين': IconsSuppliers,
  'الشروط والأحكام': IconsTerms,
  'أنواع الإستلام': IconsReceiveType,
  'الفروع': IconsBranches,
  'سجلات النظام': IconsLogs,
  'الإشعارات': IconsNotification,
  'الإعدادات': IconsSettings,
  // English version if needed by API
  'Settings': IconsSettings,
  'Branches': IconsBranches,
  'Suppliers': IconsSuppliers,
  'Logs': IconsLogs,
  'Notifications': IconsNotification,
}

const getGroupIcon = (title) => {
  return iconMap[title] || IconsSettings
}

const permissionGroups = ref([])

const toggleGroup = (index) => {
  permissionGroups.value[index].expanded = !permissionGroups.value[index].expanded
}

const fetchPermissions = async () => {
  try {
    loading.value = true
    const res = await api('/v1/admin/permissions')
    
    if (res && res.data) {
      // Handle both grouped object or flat array
      const apiData = Array.isArray(res.data) ? { [t('menu.settings')]: res.data } : res.data
      
      permissionGroups.value = Object.entries(apiData).map(([key, perms]) => ({
        title: key,
        icon: getGroupIcon(key),
        expanded: false, // Start collapsed for cleaner look
        permissions: perms.map(p => ({
          id: p.id,
          label: p.display_name || p.name_localized?.[locale.value] || p.name
        })),
        allSelected: false
      }))
    }
  } catch (err) {
    console.error('Error fetching permissions:', err)
  } finally {
    loading.value = false
  }
}

const toggleAllInGroup = (group) => {
  if (group.allSelected) {
    group.permissions.forEach(p => {
      if (!selectedPermissions.value.includes(p.id)) {
        selectedPermissions.value.push(p.id)
      }
    })
  } else {
    group.permissions.forEach(p => {
      const index = selectedPermissions.value.indexOf(p.id)
      if (index !== -1) {
        selectedPermissions.value.splice(index, 1)
      }
    })
  }
}

const updateGroupAllSelected = (group) => {
  group.allSelected = group.permissions.length > 0 && group.permissions.every(p => selectedPermissions.value.includes(p.id))
}

const handleSave = async () => {
  if (!roleData.name.ar || !roleData.name.en) {
      toastError(t('errors.pleaseFillAllFields'))
      return
  }

  errors.value = {}
  loading.value = true
  
  try {
    await api('/v1/admin/roles', {
      method: 'POST',
      body: {
        name: roleData.name,
        permissions: selectedPermissions.value
      }
    })
    
    success(t('buttons.save_changes'))
    setTimeout(() => navigateTo(localePath('/settings/roles')), 500)
  } catch (err) {
    if (err?.data?.errors) {
      errors.value = err.data.errors
    }
    toastError(err?.data?.message || t('errors.somethingWentWrong'))
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  navigateTo(localePath('/settings/roles'))
}

onMounted(() => {
  fetchPermissions()
})
</script>

<style scoped>
.roles-add-page {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Accordion Specific Styling */
.accordion-item {
  border: 1px solid #f0f1f3;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  transition: all 0.3s ease;
}

.accordion-header {
  padding: 1.25rem 1.5rem;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.accordion-header.active {
  background-color: #fafbfc;
}

.accordion-header:hover {
  background-color: #f8f9fa;
}

.group-title {
  color: #333;
  font-weight: 600;
  font-size: 16px;
}

.group-icon-box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: var(--primary-color);
  background-color: #f1f4f9;
}

.accordion-body {
  padding: 1.5rem;
  border-top: 1px solid #f1f3f5;
  background-color: #fff;
}

.permissions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.permission-item {
  min-width: 140px;
}

/* Icons & Indicators */
.arrow-indicator {
  transition: transform 0.3s ease;
  color: #adb5bd;
}

.arrow-indicator.active {
  transform: rotate(180deg);
  color: var(--secondary-color);
}

/* Custom Checkbox Senior Styles */
.custom-check {
  width: 20px;
  height: 20px;
  border-radius: 6px !important;
  border: 2px solid #ced4da;
  box-shadow: none !important;
  cursor: pointer;
}

.custom-check:checked {
  background-color: var(--secondary-color) !important;
  border-color: var(--secondary-color) !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e") !important;
}

/* General Layout helpers */
.text-dark-blue {
    color: #1a2b4b;
}

.fs-14 {
    font-size: 14px;
}

.min-btn-width {
    min-width: 120px;
}

.text-btn {
    font-weight: 500;
    color: #6c757d;
}

.text-btn:hover {
    color: #343a40;
}

/* Transitions */
.accordion-slide-enter-active, 
.accordion-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 800px;
}

.accordion-slide-enter-from, 
.accordion-slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

</style>
