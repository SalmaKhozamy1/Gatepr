<template>
  <ModalsAppModal
    :model-value="modelValue"
    :title="title || 'حذف العنصر'"
    @update:model-value="emit('update:modelValue', $event)"
    :show-header-icon="false"
  >
    <div class="flex-column-center gap-md text-center">
      <!-- أيقونة التحذير -->
      <div class="delete-icon-wrapper">
        <span class="delete-icon">!</span>
      </div>

      <h5 class="fw-bold">{{ title }}</h5>

      <p class="text-muted">
        هل أنت متأكد من انك تريد حذف {{ itemType }} "{{ itemName }}" ؟
        <br />
        <span class="text-danger small">لايمكنك استعادة البيانات</span>
      </p>
    </div>

    <template #footer>
      <div class="flex-center gap-sm w-100">
        <button
          class="custom-btn danger-btn min-btn-width"
          @click="handleConfirm"
          :disabled="loading"
        >
          <span v-if="loading">جاري الحذف...</span>
          <span v-else>تأكيد الحذف</span>
        </button>
        <button
          class="custom-btn text-btn min-btn-width"
          @click="emit('update:modelValue', false)"
          :disabled="loading"
        >
          إلغاء
        </button>
      </div>
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  itemType: String,   // مثال: "محافظة"
  itemName: String,   // مثال: "القاهرة"
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const loading = ref(false)

const handleConfirm = () => {
  emit('confirm', {
    setLoading: (val) => { loading.value = val },
    close: () => emit('update:modelValue', false)  // ✅ بيقفل الـ modal
  })
}
</script>

<style scoped>
.delete-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(var(--danger-rgb), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  font-size: 28px;
  font-weight: bold;
  color: var(--danger);
}
</style>