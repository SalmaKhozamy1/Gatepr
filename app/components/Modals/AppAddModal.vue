<template>
  <ModalsAppModal
    :model-value="modelValue"
    :title="title"
    :icon="icon"
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
          :placeholder="field.placeholder || `اختر ${field.label}`"
        />

        <!-- Multi Select -->
        <InputsFormMultiSelect
          v-else-if="field.type === 'multi-select'"
          :model-value="getFieldValue(field.key)"
          @update:model-value="setFieldValue(field.key, $event)"
          :options="field.options || []"
          :placeholder="field.placeholder || `اختر ${field.label}`"
        />

        <!-- Input -->
        <InputsFormInput
          v-else
          :model-value="getFieldValue(field.key)"
          @update:model-value="setFieldValue(field.key, $event)"
          :placeholder="field.placeholder || `أدخل ${field.label}`"
          :type="field.type || 'text'"
        />

        <span v-if="errors[field.key]" class="text-danger small mt-1">
          {{ errors[field.key] }}
        </span>
      </div>
    </div>

    <template #footer>
      <div class="flex-end gap-2 w-100">
        <button class="custom-btn text-btn min-btn-width" @click="emit('update:modelValue', false)" :disabled="loading">إلغاء</button>
        <button class="custom-btn secondary-btn min-btn-width" @click="handleSubmit" :disabled="loading">
          <span v-if="loading">جاري الحفظ...</span>
          <span v-else>حفظ</span>
        </button>
      </div>
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  icon: Object,
  fields: Array,
})

const emit = defineEmits(['update:modelValue', 'submit'])

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
  }
})

const getFieldValue = (key) => {
  return key.split('.').reduce((o, i) => o?.[i], formData.value)
}

const setFieldValue = (key, value) => {
  const keys = key.split('.')
  if (keys.length === 2) {
    formData.value[keys[0]][keys[1]] = value
  } else {
    formData.value[key] = value
  }
}

// ✅ toggle للـ multi-select
const toggleMultiSelect = (key, value) => {
  const current = getFieldValue(key) || []
  const index = current.indexOf(value)
  if (index === -1) {
    setFieldValue(key, [...current, value])
  } else {
    setFieldValue(key, current.filter(v => v !== value))
  }
}

const handleSubmit = async () => {
  errors.value = {}
  loading.value = true
  try {
    emit('submit', {
      data: formData.value,
      setErrors: (errs) => { errors.value = errs },
      setLoading: (val) => { loading.value = val },
      close: () => emit('update:modelValue', false)
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.col-span-2 {
  grid-column: span 2;
}
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