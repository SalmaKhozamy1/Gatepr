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
              <span class="field-value">{{ getValue(field.key) ?? '—' }}</span>
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
          <h5>{{ getValue(field.key) ?? '—' }}</h5>
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

// Resolves dot-path from data; if final value is a locale object {ar, en}, picks current locale
const getValue = (key) => {
  const val = key.split('.').reduce((o, i) => o?.[i], props.data)
  if (val && typeof val === 'object' && ('ar' in val || 'en' in val)) {
    return val[locale.value] ?? val.ar ?? val.en ?? '—'
  }
  return val ?? '—'
}
</script>

<style scoped>
/* Section label — same style as add.vue */
.section-label {
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 10px;
}
.section-label :deep(svg) {
  color: var(--secondary-color) !important;
}
.view-field {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
}
.field-label {
  font-size: 13px;
  color: var(--placeholder);
  white-space: nowrap;
}
.field-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  text-align: start;
}

/* Flat mode (backward-compat) */
.item_details {
  padding: 8px;
}
.item_details:nth-child(even) {
  background: rgba(102, 112, 133, 0.05);
}
.view-field:nth-child(4n + 1),
.view-field:nth-child(4n + 2) {
  background-color: var(--light-primary-color);
  border-radius: var(--radius-sm);
}
</style>