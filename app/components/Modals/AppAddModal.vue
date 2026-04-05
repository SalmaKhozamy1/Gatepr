<template>
  <ModalsAppModal
    :model-value="modelValue"
    :title="title"
    :icon="icon"
    :close-on-backdrop="false"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="grid grid-2 gap-sm">
      <div
        v-for="field in fields"
        :key="field.key"
        class="form-group w-100"
        :class="{ 'col-span-2': field.type === 'multi-select' }"
      >
        <label class="form-label">{{ field.label }}</label>

        <!-- Select -->
        <InputsFormSelect
          v-if="field.type === 'select'"
          :model-value="getFieldValue(field.key)"
          @update:model-value="setFieldValue(field.key, $event)"
          :options="field.options || []"
          :placeholder="field.placeholder || `${t('placeholders.select_multi')} ${field.label}`"
          :error="errors[field.key]"
        />

        <!-- Multi Select -->
        <InputsFormMultiSelect
          v-else-if="field.type === 'multi-select'"
          :model-value="getFieldValue(field.key)"
          @update:model-value="setFieldValue(field.key, $event)"
          :options="field.options || []"
          :placeholder="field.placeholder || `${t('placeholders.select_multi')} ${field.label}`"
          :error="errors[field.key]"
        />

        <!-- Input -->
        <InputsFormInput
          v-else
          :model-value="getFieldValue(field.key)"
          @update:model-value="setFieldValue(field.key, $event)"
          :placeholder="field.placeholder || `${t('placeholders.enter_dynamic', { name: field.label }) || (locale === 'ar' ? 'أدخل' : 'Enter')} ${field.label}`"
          :type="field.type || 'text'"
          :error="errors[field.key]"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex-end gap-2 w-100">
        <button class="custom-btn text-btn min-btn-width" @click="emit('update:modelValue', false)" :disabled="loading">{{ t('common.cancel') }}</button>
        <button class="custom-btn secondary-btn min-btn-width" @click="handleSubmit" :disabled="loading">
          <span v-if="loading">{{ t('common.saving') }}</span>
          <span v-else>{{ t('common.save') }}</span>
        </button>
      </div>
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const props = defineProps({
  modelValue: Boolean,
  title: String,
  icon: Object,
  fields: Array,
})

const emit = defineEmits(['update:modelValue', 'submit', 'change'])

const loading = ref(false)
const errors = ref({})

const buildFormData = () => {
  const data = {}
  props.fields?.forEach(field => {
    const keys = field.key.split('.')
    if (field.type === 'multi-select') {
      data[field.key] = []        // ✅ array فاضية للـ multi-select
    } else if (keys.length === 2) {
      if (!data[keys[0]]) data[keys[0]] = {}
      data[keys[0]][keys[1]] = ''
    } else {
      data[field.key] = ''
    }
  })
  return data
}

const formData = ref(buildFormData())

watch(() => props.modelValue, (val) => {
  if (val) {
    formData.value = buildFormData()
    errors.value = {}
    loading.value = false
  }
})

const getFieldValue = (key) => {
  return key.split('.').reduce((o, i) => o?.[i], formData.value)
}

const validateField = async (field, value) => {
  if (!field.rules) return true
  try {
    if (typeof field.rules.validate === 'function') {
      await field.rules.validate(value)
    }
    errors.value[field.key] = null
    return true
  } catch (err) {
    errors.value[field.key] = err.message
    return false
  }
}

const setFieldValue = async (key, value) => {
  const keys = key.split('.')
  if (keys.length === 2) {
    formData.value[keys[0]][keys[1]] = value
  } else {
    formData.value[key] = value
  }

  // Real-time validation
  const field = props.fields?.find(f => f.key === key)
  if (field) {
    await validateField(field, value)
  }
  
  emit('change', { key, value })
}

const handleSubmit = async () => {
  errors.value = {}
  
  // Validate all fields
  let isValid = true
  for (const field of props.fields || []) {
    const value = getFieldValue(field.key)
    const fieldValid = await validateField(field, value)
    if (!fieldValid) isValid = false
  }

  if (!isValid) return

  loading.value = true
  emit('submit', {
    data: formData.value,
    setErrors: (errs) => { 
      errors.value = { ...errors.value, ...errs } 
      loading.value = false
    },
    setLoading: (val) => { loading.value = val },
    close: () => {
      loading.value = false
      emit('update:modelValue', false)
    }
  })
}

defineExpose({
  setFieldValue,
  handleSubmit
})
</script>

<style scoped>
.multi-select-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: var(--radius-sm);
  max-height: 150px;
  overflow-y: auto;
  min-height: 42px;
}
.multi-select-item {
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid var(--border-color, #e0e0e0);
  cursor: pointer;
  font-size: var(--size-sm);
  transition: all 0.2s;
  user-select: none;
}
.multi-select-item.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}
.multi-select-item:hover:not(.active) {
  background-color: var(--light-primary-color);
}
</style>