<template>
  <div class="role-form-container">
    <!-- Role Name Section -->
    <CardsCustomCard :title="cardTitle">
      <div class="grid grid-2 gap-sm">
        <InputsFormInput
          :modelValue="roleData.name.ar"
          @update:modelValue="(val) => updateName('ar', val)"
          :label="t('labels.roles_name_ar')"
          :placeholder="t('placeholders.name_ar')"
          required
          :disabled="mode === 'view'"
          :error="errors['name.ar']"
          @blur="$emit('blur-name', 'ar')"
        />
        <InputsFormInput
          :modelValue="roleData.name.en"
          @update:modelValue="(val) => updateName('en', val)"
          :label="t('labels.roles_name_en')"
          :placeholder="t('placeholders.name_en')"
          required
          :disabled="mode === 'view'"
          :error="errors['name.en']"
          @blur="$emit('blur-name', 'en')"
        />
      </div>
      <!-- Global Save button moved to the bottom -->
    </CardsCustomCard>

    <div class="accordion d-flex flex-column gap-3 mt-3" id="permissionsAccordion">

      <!-- Settings permissions (Parent Group) -->
      <AppAccordion
        id="settings-group"
        parentId="permissionsAccordion"
        :title="t('menu.settings')"
        :icon="IconsSettings"
        :show="true"
      >
        <div class="nested-accordion grid grid-2 gap-sm" id="settingsInner">
          <AppAccordion
            v-for="(group, index) in settingsPermissions"
            :key="index"
            :id="'settings-' + index"
            parentId="settingsInner"
            :show="true"
          >
            <!-- Select All in HEADER slot -->
            <template #header>
              <InputsApprove
                :label="translateModel(group.model)"
                :modelValue="isGroupAllSelected(group)"
                :disabled="mode === 'view'"
                @update:modelValue="(val) => toggleGroup(group, val)"
              />
            </template>

            <div class="flex-start gap-xs flex-wrap">
              <InputsApprove
                v-for="permission in group.permissions"
                :key="permission.id"
                :label="translateAction(permission.action)"
                :id="'perm-' + permission.id"
                :modelValue="internalSelectedPermissions"
                :value="permission.id"
                :disabled="mode === 'view'"
                @update:modelValue="(val) => internalSelectedPermissions = val"
              />
            </div>
          </AppAccordion>
        </div>

      </AppAccordion>

      <!-- Other Permission Groups (Parents) -->
      <AppAccordion
        v-for="(group, groupIndex) in otherPermissionGroups"
        :key="groupIndex"
        :id="'group-' + groupIndex"
        parentId="permissionsAccordion"
        :title="translateModel(group.model)"
        :icon="getGroupIcon(group.model)"
        :show="groupIndex === 0"
      >
        <div class="permissions-grid">
          <div
            v-for="permission in group.permissions"
            :key="permission.id"
            class="permission-item flex-start gap-sm"
          >
            <InputsApprove
              :label="translateAction(permission.action)"
              :id="'perm-' + permission.id"
              :modelValue="internalSelectedPermissions"
              :value="permission.id"
              :disabled="mode === 'view'"
              @update:modelValue="(val) => internalSelectedPermissions = val"
            />
          </div>
        </div>

      </AppAccordion>
    </div>

    <!-- Global Actions Section -->
    <div v-if="mode != 'view'">
      <ButtonsFormActions 
        :loading="loading" 
        :btnCancelClass="'white'"
        @cancel="handleCancel" 
        @save="onSave"
      />
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

const props = defineProps({
  mode: {
    type: String,
    default: 'create'
  },
  roleData: {
    type: Object,
    required: true
  },
  permissionGroups: {
    type: Array,
    default: () => []
  },
  selectedPermissions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  savingGroup: {
    type: String,
    default: null
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'update:selectedPermissions', 
  'update:roleData',
  'save',   
  'cancel',
  'blur-name'
])

const { t } = useI18n()

/* =============================
   COMPUTED
============================== */
const isView = computed(() => props.mode === 'view')
const isEdit = computed(() => props.mode === 'edit')

const cardTitle = computed(() => {
  const base = t('labels.role')
  if (isView.value) return t('common.view') + ' ' + base
  if (isEdit.value) return t('common.edit') + ' ' + base
  return t('common.add') + ' ' + base
})

const settingsModels = [
  'Governorate',
  'Area',
  'User',
  'Role',
  'Supplier Type',
  'Category',
  'Purchasing Unit',
  'Receipt Type',
  'Terms',
  'permission',
  'permissions'
]

const settingsPermissions = computed(() =>
  props.permissionGroups.filter(group => settingsModels.includes(group.model))
)

const otherPermissionGroups = computed(() =>
  props.permissionGroups.filter(g => !settingsModels.includes(g.model))
)

const internalSelectedPermissions = computed({
  get: () => props.selectedPermissions,
  set: (val) => emit('update:selectedPermissions', val)
})

/* =============================
   UPDATES
============================== */
const updateName = (lang, value) => {
  const newData = { 
    ...props.roleData, 
    name: { 
      ...props.roleData.name, 
      [lang]: value 
    } 
  }
  emit('update:roleData', newData)
}

/* =============================
   MAPPING HELPERS
============================== */
const modelTranslations = {
  'Governorate': 'settings.governorates',
  'Area': 'settings.areas',
  'User': 'settings.users',
  'Role': 'settings.roles',
  'Supplier Type': 'settings.supplier_types',
  'Category': 'settings.categories',
  'Purchasing Unit': 'settings.purchasing_units',
  'Receipt Type': 'settings.receipt_types',
  'Terms': 'settings.terms_and_conditions',
  'Activity Log': 'settings.logs',
  'Branch': 'menu.branches',
  'Notification': 'menu.notifications',
  'Static Page': 'settings.terms_and_conditions',
  'Item': 'menu.categories',
  'Supplier': 'settings.supplier',
  "Supplier Profile Update Request": 'menu.supplier_registration_requests',
  "Supplier Profile": "menu.supplier_profile",
  "Item": "menu.items-management",
  "Item Action": "menu.item-managment-action",
  "Item Actions": "menu.item-managment-actions",
  "permission": "labels.permission",
  "permissions.permission": "labels.permission",
  "permissions": "labels.permissions"
}

const actionTranslations = {
  'view': 'common.view',
  'index': 'common.view',
  'show': 'common.view',
  'add': 'common.add',
  'create': 'common.add',
  'store': 'common.add',
  'edit': 'common.edit',
  'update': 'common.edit',
  'delete': 'common.delete',
  'destroy': 'common.delete',
  'delete-forever': 'common.delete',
  'restore': 'common.restore',
  'active-inactive': 'common.status',
}

const translateModel = (model) => {
  const key = modelTranslations[model]
  return key ? t(key) : model
}

const translateAction = (action) => {
  const key = actionTranslations[action.toLowerCase()]
  return key ? t(key) : action
}

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
  'permissions': IconsSettings,
}

const getGroupIcon = (model) => iconMap[model] || IconsSettings

/* =============================
   SELECT ALL LOGIC
============================== */
const isGroupAllSelected = (group) => {
  if (!group || !group.permissions.length) return false
  return group.permissions.every(p => internalSelectedPermissions.value.includes(p.id))
}

const toggleGroup = (group, checked) => {
  if (isView.value) return
  const ids = group.permissions.map(p => p.id)
  if (checked) {
    const newSelected = new Set([...internalSelectedPermissions.value, ...ids])
    internalSelectedPermissions.value = Array.from(newSelected)
  } else {
    internalSelectedPermissions.value = internalSelectedPermissions.value.filter(id => !ids.includes(id))
  }
}

/* =============================
   EMITS
============================== */
const onSave = () => emit('save') 
const handleCancel = () => emit('cancel')

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

:deep(.nested-accordion .accordion-item) {
  border: 1px solid #F4F5F6 !important;
}
</style>
