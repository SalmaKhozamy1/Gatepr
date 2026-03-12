<template>
  <Teleport to="#search-teleport-target">
    <div class="flex-start gap-sm w-100 flex-wrap">
      <div class="flex-grow-1 flex-start gap-sm">
        <InputsFormInput
          v-model="searchQuery"
          :placeholder="placeholder"
          @keyup.enter="handleFilter"
        />

        <InputsFormSelect
          v-for="filter in filters"
          :key="filter.key"
          v-model="filterValues[filter.key]"
          :options="filter.options || []"
          :placeholder="filter.placeholder || 'اختر ...'"
          class="min-w-40"
        />
      </div>

      <div class="flex-start gap-sm">
        <button class="custom-btn primary-btn min-btn-width fltr_btn" @click="handleFilter">
          <IconsSearch />
          <span>بحث</span>
        </button>
        <ButtonsResetButton @reset="handleReset" />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watchEffect } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'بحث ...'
  },
  filters: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter', 'reset'])

const searchQuery = ref('')
const filterValues = reactive({})

// ✅ بيتابع لما الـ filters تتغير وبيضيف الـ keys الجديدة
watchEffect(() => {
  props.filters.forEach(f => {
    if (!(f.key in filterValues)) {
      filterValues[f.key] = null
    }
  })
})

const handleFilter = () => {
  emit('filter', {
    search: searchQuery.value.trim(),
    ...filterValues
  })
}

const handleReset = () => {
  searchQuery.value = ''
  props.filters.forEach(f => { filterValues[f.key] = null })
  emit('reset')
}
</script>