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
      >
        <label class="form-label">{{ field.label }}</label>
        <InputsFormInput
          :model-value="getFieldValue(field.key)"
          @update:model-value="setFieldValue(field.key, $event)"
          :placeholder="field.placeholder || `أدخل ${field.label}`"
          :type="field.type || 'text'"
        />
        <span v-if="errors[field.key]" class="text-danger small">
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

/* =============================
   بنبني الـ formData ديناميكي من الـ fields
============================== */
const buildFormData = () => {
  const data = {}
  props.fields?.forEach(field => {
    // بنتعامل مع nested keys زي name.ar
    const keys = field.key.split('.')
    if (keys.length === 2) {
      if (!data[keys[0]]) data[keys[0]] = {}
      data[keys[0]][keys[1]] = ''
    } else {
      data[field.key] = ''
    }
  })
  return data
}

const formData = ref(buildFormData())

/* =============================
   reset لما الـ modal يتفتح
============================== */
watch(() => props.modelValue, (val) => {
  if (val) {
    formData.value = buildFormData()
    errors.value = {}
  }
})

/* =============================
   GET VALUE من nested key
============================== */
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

/* =============================
   SUBMIT
============================== */
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