<template>
  <div class="role-form-container">
    <CardsCustomCard :title="cardTitle">
      <div class="grid grid-2 gap-sm">
        <InputsFormInput
          :modelValue="roleData.name.ar"
          @update:modelValue="(val) => updateName('ar', val)"
          :label="t('labels.roles_name_ar')"
          :placeholder="t('placeholders.name_ar')"
          required
          :disabled="isView"
          :error="errors['name.ar']"
          @blur="$emit('blur-name', 'ar')"
        />
        <InputsFormInput
          :modelValue="roleData.name.en"
          @update:modelValue="(val) => updateName('en', val)"
          :label="t('labels.roles_name_en')"
          :placeholder="t('placeholders.name_en')"
          required
          :disabled="isView"
          :error="errors['name.en']"
          @blur="$emit('blur-name', 'en')"
        />
      </div>
    </CardsCustomCard>

    <div class="accordion d-flex flex-column gap-3 mt-3" id="permissionsAccordion">

      <!-- Settings Group -->
      <AppAccordion
        v-if="settingsPermissions.length"
        id="settings-group"
        parentId="permissionsAccordion"
        :title="t('menu.settings')"
        :icon="IconsSettings"
        :show="true"
      >
        <div class="nested-accordion grid grid-2 gap-sm" id="settingsInner">
          <AppAccordion
            v-for="(group, index) in settingsPermissions"
            :key="group.model"
            :id="'settings-' + index + '-' + group.model"
            parentId="settingsInner"
            :show="true"
          >
            <template #header>
              <InputsApprove
                :id="'select-all-' + group.model"
                :label="group.model"
                :modelValue="isGroupAllSelected(group)"
                :disabled="isView"
                @update:modelValue="(val) => toggleGroup(group, val)"
              />
            </template>
            <div class="flex-start gap-xs flex-wrap">
              <InputsApprove
                v-for="permission in group.permissions"
                :key="permission.id"
                :label="permission.action"
                :id="'perm-' + permission.id"
                :modelValue="localSelectedPermissions"
                :value="String(permission.id)"
                :disabled="isView"
                @update:modelValue="updateSelected"
              />
            </div>
          </AppAccordion>
        </div>
      </AppAccordion>

      <!-- Other Groups -->
      <AppAccordion
        v-for="(group, index) in otherPermissionGroups"
        :key="group.model"
        :id="'group-' + index + '-' + group.model"
        parentId="permissionsAccordion"
        :title="group.model"
        :icon="getGroupIcon(group.model)"
        :show="index === 0"
      >
        <div class="permissions-grid">
          <InputsApprove
            v-for="permission in group.permissions"
            :key="permission.id"
            :label="permission.action"
            :id="'perm-' + permission.id"
            :modelValue="localSelectedPermissions"
            :value="String(permission.id)"
            :disabled="isView"
            @update:modelValue="updateSelected"
          />
        </div>
      </AppAccordion>

    </div>

    <div v-if="!isView">
      <ButtonsFormActions
        :loading="loading"
        btnCancelClass="white"
        @cancel="handleCancel"
        @save="onSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  IconsSettings,
  IconsCategories,
  IconsSuppliers,
  IconsBranches,
  IconsLogs,
  IconsNotification,
} from '#components'

/* =============================
   PROPS & EMITS
============================== */
const props = defineProps({
  mode:                { type: String,  default: 'create' },
  roleData:            { type: Object,  required: true },
  permissionGroups:    { type: Array,   default: () => [] },
  selectedPermissions: { type: Array,   default: () => [] },
  loading:             { type: Boolean, default: false },
  errors:              { type: Object,  default: () => ({}) },
})

const emit = defineEmits([
  'update:selectedPermissions',
  'update:roleData',
  'save',
  'cancel',
  'blur-name',
])

const { t } = useI18n()

/* =============================
   MODE HELPERS
============================== */
const isView = computed(() => props.mode === 'view')
const isEdit = computed(() => props.mode === 'edit')

const cardTitle = computed(() => {
  const base = t('labels.role')
  if (isView.value) return `${t('common.view')} ${base}`
  if (isEdit.value) return `${t('common.edit')} ${base}`
  return `${t('common.add')} ${base}`
})

/* =============================
   SETTINGS MODELS
============================== */
const SETTINGS_MODELS = new Set([
  'Governorate',     'Governorates',      'المحافظات',
  'Area',            'Areas',              'المناطق',
  'User',            'Users',              'المستخدمين',
  'Role',            'Roles',              'الأدوار',
  'Supplier Type',   'Supplier Types',    'أنواع الموردين',
  'Category',        'Categories',         'التصنيفات',
  'Purchasing Unit', 'Purchasing Units',  'وحدات الشراء',
  'Receipt Type',    'Receipt Types',     'أنواع الإيصالات',
  'Static Page',     'Static Pages',       'الصفحات الثابتة'
])

const settingsPermissions = computed(() => {
  const seenModels = new Set()
  return props.permissionGroups.filter(g => {
    if (SETTINGS_MODELS.has(g.model) && !seenModels.has(g.model)) {
      seenModels.add(g.model)
      return true
    }
    return false
  })
})

const otherPermissionGroups = computed(() =>
  props.permissionGroups.filter(g => !SETTINGS_MODELS.has(g.model))
)

/* =============================
   SELECTED PERMISSIONS (SYNCED)
============================== */
const localSelectedPermissions = ref([])

watch(() => props.selectedPermissions, (newVal) => {
  localSelectedPermissions.value = Array.isArray(newVal) ? newVal.map(String) : newVal
}, { immediate: true, deep: true })

const updateSelected = (val) => {
  localSelectedPermissions.value = val
  emit('update:selectedPermissions', Array.isArray(val) ? val.map(String) : val)
}

/* =============================
   ICON MAP
============================== */
const ICON_MAP = {
  'Activity Log':                    IconsLogs,
  'Branch':                          IconsBranches,
  'Item':                            IconsCategories,
  'Item Action':                     IconsCategories,
  'Item Actions':                    IconsCategories,
  'Notification':                    IconsNotification,
  'Supplier':                        IconsSuppliers,
  'Supplier Profile':                IconsSuppliers,
  'Supplier Profile Update Request': IconsSuppliers,
  'permissions':                     IconsSettings,
}

const getGroupIcon = (model) => ICON_MAP[model] ?? IconsSettings

/* =============================
   SELECT ALL LOGIC
============================== */
const isGroupAllSelected = (group) => {
  if (!group?.permissions?.length) return false
  const selectedSet = new Set(localSelectedPermissions.value.map(String))
  return group.permissions.every(p => selectedSet.has(String(p.id)))
}

const toggleGroup = (group, checked) => {
  if (isView.value || !group?.permissions) return
  
  const groupIds = group.permissions.map(p => String(p.id))
  const currentSelected = new Set(localSelectedPermissions.value.map(String))
  
  if (checked) {
    groupIds.forEach(id => currentSelected.add(id))
  } else {
    groupIds.forEach(id => currentSelected.delete(id))
  }
  
  updateSelected(Array.from(currentSelected))
}

/* =============================
   ROLE NAME UPDATE
============================== */
const updateName = (lang, value) => {
  emit('update:roleData', {
    ...props.roleData,
    name: { ...props.roleData.name, [lang]: value },
  })
}

/* =============================
   ACTIONS
============================== */
const onSave       = () => emit('save')
const handleCancel = () => emit('cancel')
</script>

<style scoped>
.permissions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 8px 0;
}

:deep(.nested-accordion .accordion-item) {
  border: 1px solid #F4F5F6 !important;
}
</style>