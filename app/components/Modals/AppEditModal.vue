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
        <!-- ✅ Select -->
        <InputsFormSelect
          v-if="field.type === 'select'"
          :model-value="getFieldValue(field.key)"
          @update:model-value="setFieldValue(field.key, $event)"
          :options="field.options || []"
          :placeholder="field.placeholder || `اختر ${field.label}`"
        />

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
      <div class="flex-end gap-sm">
        <button
          class="custom-btn text-btn min-btn-width"
          @click="emit('update:modelValue', false)"
          :disabled="loading"
        >
          إلغاء
        </button>
        <button
          class="custom-btn secondary-btn min-btn-width"
          @click="handleSubmit"
          :disabled="loading"
        >
          <span v-if="loading">جاري الحفظ...</span>
          <span v-else>حفظ التعديلات</span>
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
  initialData: Object,
})

const emit = defineEmits(['update:modelValue', 'submit'])

const loading = ref(false)
const errors = ref({})

/* =============================
   BUILD FORM DATA
============================== */
const buildFormData = () => {
  const data = {}
  props.fields?.forEach(field => {
    const keys = field.key.split('.')
    if (keys.length === 2) {
      if (!data[keys[0]]) data[keys[0]] = {}
      data[keys[0]][keys[1]] = props.initialData?.[keys[0]]?.[keys[1]] ?? ''
    } else {
      data[field.key] = props.initialData?.[field.key] ?? ''
    }
  })
  return data
}

const formData = ref(buildFormData())

/* =============================
   GET & SET nested keys
   مثال: "name.ar" => formData.name.ar
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
   WATCHERS
============================== */
watch(() => props.modelValue, (val) => {
  if (val) {
    formData.value = buildFormData()
    errors.value = {}
  }
})

watch(() => props.initialData, () => {
  if (props.modelValue) {
    formData.value = buildFormData()
  }
}, { deep: true })

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