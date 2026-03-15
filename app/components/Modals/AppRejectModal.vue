<template>
  <ModalsAppModal
    :model-value="modelValue"
    :title="title || 'رفض الطلب'"
    :icon="icon"
    :close-on-backdrop="false"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="form-group w-100">
      <label class="form-label">سبب الرفض</label>
      <textarea
        v-model="reason"
        class="form-textarea"
        placeholder="اكتب سبب الرفض هنا..."
        rows="4"
      />
      <span v-if="error" class="text-danger small mt-1">{{ error }}</span>
    </div>

    <template #footer>
      <div class="flex-end gap-2 w-100">
        <button
          class="custom-btn text-btn min-btn-width"
          @click="handleClose"
          :disabled="loading"
        >
          إلغاء
        </button>
        <button
          class="custom-btn danger-btn min-btn-width"
          @click="handleSubmit"
          :disabled="loading"
        >
          <span v-if="loading">جاري الحفظ...</span>
          <span v-else>رفض</span>
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
  supplierId: Number,
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const reason = ref('')
const error = ref('')
const loading = ref(false)

// ✅ reset لما الـ modal يتفتح
watch(() => props.modelValue, (val) => {
  if (val) {
    reason.value = ''
    error.value = ''
  }
})

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSubmit = () => {
  error.value = ''

  if (!reason.value.trim()) {
    error.value = 'سبب الرفض مطلوب'
    return
  }

  emit('confirm', {
    reason: reason.value.trim(),
    setLoading: (val) => { loading.value = val },
    close: () => emit('update:modelValue', false)
  })
}
</script>

<style scoped>
.form-textarea {
  width: 100%;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  font-family: inherit;
  font-size: var(--size-sm);
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
  color: var(--text-color, #374151);
  background: white;
}

.form-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 15%, transparent);
}

.danger-btn {
  background-color: var(--danger-color, #ef4444);
  color: white;
  border: none;
}

.danger-btn:hover:not(:disabled) {
  opacity: 0.9;
}
</style>