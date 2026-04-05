<template>
  <div class="flex-start gap-sm flex-wrap">

    <InputsFormInput
      v-if="placeholder"
      v-model="searchQuery"
      :placeholder="placeholder"
      @keyup.enter="handleFilter({ search: searchQuery, ...filterValues, ...dateValues })"
      class="flex-grow-1 search"
    />

    <div v-for="dateFilter in dateFilters" :key="dateFilter.key" class="date-input-wrapper col">
      <div class="position-relative">
        <FlatPickr
          v-model="dateValues[dateFilter.key]"
          :placeholder="dateFilter.label"
          class="form-input flatpickr-input"
          :config="flatpickrConfig"
        />
        <IconsCalander class="calendar-icon" width="18" height="18" />
      </div>
    </div>

    <InputsFormSelect
      v-for="filter in filters"
      :key="filter.key"
      v-model="filterValues[filter.key]"
      :options="filter.options || []"
      class="col"
      :placeholder="filter.placeholder || t('placeholders.select')"
    />

    <Filter_Button 
      :loading="loading" 
      :search="searchQuery"
      :filters="{ ...filterValues, ...dateValues }"
      @filter="handleFilter" 
      @reset="handleReset"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FlatPickr from 'vue-flatpickr-component'
import { Arabic } from 'flatpickr/dist/l10n/ar.js'

const { t, locale } = useI18n() 

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

const flatpickrConfig = computed(() => ({
  dateFormat: 'Y-m-d',
  locale: locale.value === 'ar' ? Arabic : 'default',
  allowInput: true,
  disableMobile: "true"
}))

watchEffect(() => {
  props.filters.forEach(f => {
    if (!(f.key in filterValues)) filterValues[f.key] = null
  })
  props.dateFilters.forEach(f => {
    if (!(f.key in dateValues)) dateValues[f.key] = ''
  })
})

const handleFilter = (payload) => {
  emit('filter', payload)
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
  min-width: 160px;
}

.form-input {
  width: 100%;
  height: 40px;
  border: 1px solid var(--border-color, #d5d7da);
  border-radius: var(--radius-sm);
  padding: 0 10px;
  padding-inline-end: 29px !important;
  font-family: inherit;
  font-size: var(--size-sm);
  background: white;
  cursor: pointer;
}

.form-input::placeholder {
  color: #8F92A1;
}

.form-input:focus {
  outline: none;
  border-color: var(--secondary-color);
}

.calendar-icon {
  position: absolute;
  top: 50%;
  inset-inline-end: 10px;
  transform: translateY(-50%);
  color: #98A2B3;
  pointer-events: none;
}
</style>