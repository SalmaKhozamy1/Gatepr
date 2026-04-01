<template>
  <ModalsAppModal
    :model-value="modelValue"
    :title="title"
    :icon="icon"
    :close-on-backdrop="false"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="modal-data flex-column-start gap-sm">

      <!-- Grouped Sections Mode -->
      <template v-if="sections && sections.length">
        <div
          v-for="section in sections"
          :key="section.label"
          class="view-section w-100"
        >
          <!-- Section Label -->
          <div class="section-label flex-start gap-xs">
            <component :is="section.icon" v-if="section.icon" width="18" height="18" />
            {{ section.label }}
          </div>

          <!-- Fields Grid -->
          <div class="grid grid-2">
            <div
              v-for="field in section.fields"
              :key="field.key"
              class="view-field flex-between gap-xs"
              :class="{ 'full-col': field.fullWidth }"
            >
              <span class="field-label">{{ field.label }}</span>
              <div v-if="resolveValue(field.key).type === 'list'" class="value-list">
                <span v-for="(item, idx) in resolveValue(field.key).value" :key="idx" class="list-item">
                  {{ item }}
                </span>
              </div>
              <span v-else class="field-value">{{ resolveValue(field.key).value }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Flat Fields Mode (backward-compatible) -->
      <template v-else-if="fields && fields.length">
        <div
          v-for="field in fields"
          :key="field.key"
          class="flex-between gap-md w-100 item_details"
        >
          <p>{{ field.label }}</p>
          <div v-if="resolveValue(field.key).type === 'list'" class="value-list">
            <h5 v-for="(item, idx) in resolveValue(field.key).value" :key="idx" class="list-item m-0">
              {{ item }}
            </h5>
          </div>
          <h5 v-else-if="resolveValue(field.key).type === 'text'">{{ resolveValue(field.key).value }}</h5>
        </div>
      </template>

    </div>

    <template v-if="footer" #footer>
      <slot name="footer" />
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  data: Object,
  fields: Array,      // flat mode (backward-compat)
  sections: Array,    // grouped mode: [{ label, icon, fields: [{ label, key, fullWidth? }] }]
  icon: [Object, Function, String],
  footer: Boolean
})

const emit = defineEmits(['update:modelValue'])
const { locale } = useI18n()

const resolveValue = (key) => {
  const val = key.split('.').reduce((o, i) => o?.[i], props.data)

  // 1. Array handling (e.g. user.branches)
  if (Array.isArray(val)) {
    if (val.length === 0) return { type: 'text', value: '—' }
    const items = val.map(item => {
      if (typeof item === 'object') {
        const name = item.LocalizedName || item.name_localized || item.name || item.title
        if (name && typeof name === 'object') return name[locale.value] || name.ar || name.en
        return name
      }
      return item
    })
    return { type: 'list', value: items }
  }

  // 2. Locale object handling {ar, en}
  if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
     return { type: 'text', value: val[locale.value] ?? val.ar ?? val.en ?? '—' }
  }

  return { type: 'text', value: val ?? '—' }
}
</script>

<style scoped>
.view-field, .item_details {
  align-items: flex-start !important;
}

.value-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: end;
}
.list-item {
  display: block;
}
</style>