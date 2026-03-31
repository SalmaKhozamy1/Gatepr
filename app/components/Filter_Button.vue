<template>
  <div class="flex-start gap-sm">
    <button
      class="custom-btn primary-btn fltr_btn min-btn-width"
      @click="handleFilterClick"
      :disabled="loading"
    >
      <span v-if="loading" class="btn-spinner"></span>
      <template v-else>
        <IconsSearch />
        <span>{{ t('common.search') }}</span>
      </template>
    </button>
    <ButtonsResetButton
      @reset="$emit('reset')"
      :disabled="loading"
    />
  </div>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  search: {
    type: String,
    default: ''
  },
  filters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['filter', 'reset'])

const handleFilterClick = () => {
  // ✅ Make search not case-sensitive (lowercase) and trimmed
  const cleanSearch = (props.search || '').trim().toLowerCase()
  emit('filter', { search: cleanSearch, ...props.filters })
}
</script>

<style scoped>
.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.min-btn-width {
  min-width: 120px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>