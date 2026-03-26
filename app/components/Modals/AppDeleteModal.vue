<template>
  <ModalsAppModal
    :has-header="false"
    :model-value="modelValue"
    :width="'max-content'"
    :close-on-backdrop="false"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex-column-center gap-sm text-center">
      <!-- أيقونة التحذير -->
      <div class="delete-icon-wrapper mb-2">
        <svg width="60" height="60" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE4E2"/>
          <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FEF3F2" stroke-width="8"/>
          <path d="M28 24V28M28 32H28.01M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z" stroke="#D92D20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <h4>{{ title }}</h4>

      <p class=" dark-gray px-3">
        {{ t('modals.are_you_sure_delete', { type: itemType, name: itemName }) }}
        <br />
        {{ t('modals.cannot_restore') }}
      </p>
    </div>

    <template #footer>
      <div class="flex-center gap-sm w-100">
        <button
          class="custom-btn text-btn min-btn-width"
          @click="emit('update:modelValue', false)"
          :disabled="loading"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          class="custom-btn danger-btn min-btn-width"
          @click="handleConfirm"
          :disabled="loading"
        >
          <span v-if="loading">{{ t('common.deleting') }}</span>
          <span v-else>{{ t('common.delete') }}</span>
        </button>
      </div>
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { ref } from 'vue'
import { useAppToast } from '~/composables/useAppToast'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { success } = useAppToast()  // ✅

const props = defineProps({
  modelValue: Boolean,
  title: String,
  itemType: String,
  itemName: String,
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const loading = ref(false)

const handleConfirm = () => {
  emit('confirm', {
    setLoading: (val) => { loading.value = val },
    close: () => {
      success(t('messages.deleted_successfully', { item: props.itemType }))  // ✅
      emit('update:modelValue', false)
    }
  })
}
</script>

