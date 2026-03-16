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

    <div class="accordion d-flex flex-column gap-3 mt-3" id="permissionsAccordion">
    <!-- Settings permissions -->
      <AppAccordion
      id="settings-group"
      parentId="permissionsAccordion"
      title="الإعدادات"
      :icon="IconsSettings"
      :show="true"
      >
      <!-- ✅Nested accordion جوا accordion -->
      <div class="nested-accordion grid grid-2 gap-sm" id="settingsInner">

        <AppAccordion
        v-for="(group, index) in settingsPermissions"
        :key="index"
        :id="'settings-' + index"
        parentId="settingsInner"
        :show="true"
        >

          <template #header>
          <InputsApprove 
            :label="group.model"
            :modelValue="isGroupAllSelected(group)"
            @update:modelValue="(val) => toggleGroup(group, val)"
          />
          </template>

        <div class="flex-between gap-sm flex-wrap">

          <InputsApprove
            v-for="permission in group.permissions"
            :key="permission.id"
            :label="permission.action"
            :id="'perm-' + permission.id"
            v-model="selectedPermissions"
            :value="permission.id"
          />

        </div>

        </AppAccordion>

      </div>
      </AppAccordion>


    <!-- Permissions Accordion -->
      <AppAccordion
       v-for="(group, groupIndex) in permissionGroups.filter(g => !settingsModels.includes(g.model))"
        :key="groupIndex"
        :id="'group-' + groupIndex"
        parentId="permissionsAccordion"
        :title="group.model"
        :icon="getGroupIcon(group.model)"
        :show="groupIndex === 0"
      >

        <!-- ✅ Nested permissions -->
        <div class="permissions-grid">
          <div
            v-for="permission in group.permissions"
            :key="permission.id"
            class="permission-item flex-start gap-sm"
          >
            <InputsApprove :label="permission.action"  :id="'perm-' + permission.id"  v-model="selectedPermissions" :value="permission.id"/>
          </div>
        </div>
      </AppAccordion>
    </div>

    <ButtonsFormActions :loading="loading" @cancel="handleCancel" @save="handleSave" class="mt-3" />
  </div>
</template>

<script setup>
definePageMeta({ fullPage: true })

import { ref, reactive, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'
import {
  IconsSettings,
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
const permissionGroups = ref([])

const roleData = reactive({
  name: { ar: '', en: '' }
})

const settingsModels = [
  'Activity Log',
  'Area',
  'Branch',
  'Category'
]
const settingsPermissions = computed(() => {
  return permissionGroups.value.filter(group =>
    settingsModels.includes(group.model)
  )
})
/* =============================
   ICON MAP
============================== */
const iconMap = {
  'Activity Log': IconsLogs,
  'Area': IconsSettingsRegions,
  'Branch': IconsBranches,
  'Category': IconsCategories,
  'Governorate': IconsGovernorates,
  'Item': IconsCategories,
  'Item Action': IconsCategories,
  'Item Actions': IconsCategories,
  'Notification': IconsNotification,
  'Purchasing Unit': IconsUnits,
  'Receipt Type': IconsReceiveType,
  'Role': IconsSettingsRoles,
  'Static Page': IconsTerms,
  'Supplier': IconsSuppliers,
  'Supplier Profile': IconsSuppliers,
  'Supplier Profile Update Request': IconsSuppliers,
  'Supplier Type': IconsSuppliers,
  'User': IconsSettingsUsers,
  'permissions.permission': IconsSettings,
}

const getGroupIcon = (model) => iconMap[model] || IconsSettings

/* =============================
   FETCH PERMISSIONS
============================== */
const fetchPermissions = async () => {
  try {
    loading.value = true
    const res = await api('/v1/admin/permissions')

    if (res?.data) {
      permissionGroups.value = res.data
    }

  } catch (err) {
    console.error('Error fetching permissions:', err)
  } finally {
    loading.value = false
  }
}

/* =============================
   SELECT ALL
============================== */
const isGroupAllSelected = (group) => {
  if (!group.permissions.length) return false
  return group.permissions.every(p => 
    selectedPermissions.value.includes(p.id)
  )
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
const toggleGroup = (group, checked) => {
  const ids = group.permissions.map(p => p.id)
  if (checked) {
    selectedPermissions.value = [...new Set([...selectedPermissions.value, ...ids])]
  } else {
    selectedPermissions.value = selectedPermissions.value.filter(id => !ids.includes(id))
  }
}
const handleCancel = () => navigateTo(localePath('/settings/roles'))

onMounted(() => fetchPermissions())
</script>

<style scoped>
.permissions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 8px 0;
}

.permission-item {
  min-width: 150px;
}

.perm-label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.custom-check {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #ced4da;
  cursor: pointer;
  accent-color: var(--secondary-color);
  flex-shrink: 0;
}

:deep(.nested-accordion .accordion-item) {
  border: 1px solid #F4F5F6 !important;
}
</style>