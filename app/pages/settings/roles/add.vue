<template>
  <div>
    <!-- Role Name Section -->
    <CardsCustomCard :title="t('settings.add') + ' ' + t('labels.role')">
      <div class="grid grid-2 gap-sm">
        <InputsFormInput
          v-model="roleData.name.ar"
          :label="t('labels.roles_name_ar')"
          :placeholder="t('placeholders.name_ar')"
          required
          :error="errors['name.ar']"
        />
        <InputsFormInput
          v-model="roleData.name.en"
          :label="t('labels.roles_name_en')"
          :placeholder="t('placeholders.name_en')"
          required
          :error="errors['name.en']"
        />
      </div>

    <ButtonsFormActions :loading="loading" @cancel="handleCancel" @save="handleSave" />
    </CardsCustomCard>

    <!-- Permissions Accordion -->
    <div class="accordion d-flex flex-column gap-3 mt-3" id="permissionsAccordion">
  
    <!-- First Accordion -->
    <AppAccordion
      id="settings-group"
      parentId="permissionsAccordion"
      title="الإعدادات"
      :icon="IconsSettings"
      :show="true"
    >
    <!-- ✅ Nested accordion -->
    <div class="nested-accordion grid grid-2 gap-sm" id="settingsInner">
      <AppAccordion
        id="governorate-group"
        parentId="settingsInner"
        :show="true"
      >
        <template #header>
          <InputsApprove label="المدن" />
        </template>
        <div class="flex-between gap-sm flex-wrap">
                <InputsApprove label="عرض" />
                <InputsApprove label="إضافة" />
                <InputsApprove label="تعديل" />
                <InputsApprove label="حذف" />
        </div>
      </AppAccordion>

      <AppAccordion
        id="governorate-group"
        parentId="settingsInner"
        :show="true"
      >
        <template #header>
          <InputsApprove label="مناطق" />
        </template>
        <div class="flex-between gap-sm flex-wrap">
                <InputsApprove label="عرض" />
                <InputsApprove label="إضافة" />
                <InputsApprove label="تعديل" />
                <InputsApprove label="حذف" />
        </div>
      </AppAccordion>

       <AppAccordion
        id="governorate-group"
        parentId="settingsInner"
        :show="true"
      >
        <template #header>
          <InputsApprove label="مستخدمين" />
        </template>
        <div class="flex-between gap-sm flex-wrap">
                <InputsApprove label="عرض" />
                <InputsApprove label="إضافة" />
                <InputsApprove label="تعديل" />
                <InputsApprove label="حذف" />
        </div>
      </AppAccordion>

       <AppAccordion
        id="governorate-group"
        parentId="settingsInner"
        :show="true"
      >
        <template #header>
          <InputsApprove label="الأدوار" />
        </template>
        <div class="flex-between gap-sm flex-wrap">
                <InputsApprove label="عرض" />
                <InputsApprove label="إضافة" />
                <InputsApprove label="تعديل" />
                <InputsApprove label="حذف" />
        </div>
      </AppAccordion>
      <div class="full-width">
        <ButtonsFormActions :loading="loading" @cancel="handleCancel" @save="handleSave" />
      </div>

    </div>
  </AppAccordion>

  <!-- Second Accordion -->
  <AppAccordion
    id="settings-group"
    parentId="permissionsAccordion"
    title="الفروع"
    :icon="IconsSettings"
    :show="true"
  >
  <div class="flex-between gap-sm flex-wrap w-75">
      <InputsApprove label="عرض" />
      <InputsApprove label="إضافة" />
      <InputsApprove label="تعديل" />
      <InputsApprove label="حذف" />
  </div>
  <div class="mt-3">
    <ButtonsFormActions :loading="loading" @cancel="handleCancel" @save="handleSave" />
  </div>
  </AppAccordion>

</div>
  </div>
</template>

<script setup>
definePageMeta({ fullPage: true })

import { ref, reactive, onMounted } from 'vue'
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
  name: { ar: '', en: '' }
})

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
  'Settings': IconsSettings,
  'Branches': IconsBranches,
  'Suppliers': IconsSuppliers,
  'Logs': IconsLogs,
  'Notifications': IconsNotification,
}

const getGroupIcon = (title) => iconMap[title] || IconsSettings

const permissionGroups = ref([])

/* =============================
   TOGGLE GROUP
============================== */
const toggleGroup = (index) => {
  permissionGroups.value[index].expanded = !permissionGroups.value[index].expanded
}

/* =============================
   FETCH PERMISSIONS
============================== */
const fetchPermissions = async () => {
  try {
    loading.value = true
    const res = await api('/v1/admin/permissions')

    if (res && res.data) {
      const apiData = Array.isArray(res.data)
        ? { [t('menu.settings')]: res.data }
        : res.data

      permissionGroups.value = Object.entries(apiData).map(([key, perms]) => ({
        title: key,
        icon: getGroupIcon(key),
        expanded: false,
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

/* =============================
   TOGGLE ALL IN GROUP
============================== */
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
      if (index !== -1) selectedPermissions.value.splice(index, 1)
    })
  }
}

const updateGroupAllSelected = (group) => {
  group.allSelected = group.permissions.length > 0 &&
    group.permissions.every(p => selectedPermissions.value.includes(p.id))
}

/* =============================
   SAVE
============================== */
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
    if (err?.data?.errors) errors.value = err.data.errors
    toastError(err?.data?.message || t('errors.somethingWentWrong'))
  } finally {
    loading.value = false
  }
}

const handleCancel = () => navigateTo(localePath('/settings/roles'))

onMounted(() => fetchPermissions())
</script>

<style scoped>
.roles-add-page {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.accordion-item {
  background: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.accordion-header {
  padding: 14px 16px;
  cursor: pointer;
  background: white;
  user-select: none;
}

.accordion-header:hover {
  background: var(--light-primary-color, #f5f8ff);
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
  flex-shrink: 0;
}

.group-title {
  color: #333;
  font-size: 15px;
  font-weight: 600;
}

.accordion-body {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background: white;
}

.permissions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.permission-item {
  min-width: 160px;
}

.form-check-label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.arrow-indicator {
  transition: transform 0.3s ease;
  color: #adb5bd;
  display: flex;
  align-items: center;
}

.arrow-indicator.active {
  transform: rotate(180deg);
  color: var(--primary-color);
}

.custom-check {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid #ced4da;
  cursor: pointer;
  accent-color: var(--secondary-color);
  flex-shrink: 0;
}

/* Transition */
.accordion-slide-enter-active,
.accordion-slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-slide-enter-from,
.accordion-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-slide-enter-to,
.accordion-slide-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.nested-accordion .accordion-item {
  border-radius: var(--radius-sm);
  border: 1px solid var(--light-gray);
  background: #FFF;
}

</style>