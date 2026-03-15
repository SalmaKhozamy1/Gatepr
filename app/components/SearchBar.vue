<template>
  <div class="flex-start gap-sm flex-wrap">

    <InputsFormInput
      v-if="placeholder"
      v-model="searchQuery"
      :placeholder="placeholder"
      @keyup.enter="handleFilter"
      class="flex-grow-1 search"
    />

    <div v-for="dateFilter in dateFilters" :key="dateFilter.key" class="date-input-wrapper col">
      <input
        type="date"
        v-model="dateValues[dateFilter.key]"
        class="form-input"
      />
    </div>

    <InputsFormSelect
      v-for="filter in filters"
      :key="filter.key"
      v-model="filterValues[filter.key]"
      :options="filter.options || []"
      class="col"
      :placeholder="filter.placeholder || t('pages.select')"
    />

    <div class="flex-start gap-sm">
      <button
        class="custom-btn primary-btn fltr_btn min-btn-wdth"
        @click="handleFilter"
        :disabled="loading"
      >
        <span v-if="loading" class="btn-spinner"></span>
        <template v-else>
          <IconsSearch />
          <span>{{ t('pages.search') }}</span>
        </template>
      </button>
      <ButtonsResetButton
        :label="t('pages.reset')"
        @reset="handleReset"
        class="min-btn-wdth"
        :disabled="loading"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n() 

const props = defineProps({
  placeholder: { type: String, default: '' },
  filters: { type: Array, default: () => [] },
  dateFilters: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['filter', 'reset'])

const searchQuery = ref('')
const filterValues = reactive({})
const dateValues = reactive({})

watchEffect(() => {
  props.filters.forEach(f => {
    if (!(f.key in filterValues)) filterValues[f.key] = null
  })
  props.dateFilters.forEach(f => {
    if (!(f.key in dateValues)) dateValues[f.key] = ''
  })
})

const handleFilter = () => {
  emit('filter', {
    search: searchQuery.value.trim(),
    ...filterValues,
    ...dateValues
  })
}

const handleReset = () => {
  searchQuery.value = ''
  props.filters.forEach(f => { filterValues[f.key] = null })
  props.dateFilters.forEach(f => { dateValues[f.key] = '' })
  emit('reset')
}
</script>

<style scoped>
.date-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.form-input {
  height: 40px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: var(--radius-sm);
  padding: 0 10px;
  font-family: inherit;
  font-size: var(--size-sm);
  background: white;
  cursor: pointer;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>