<template>
  <Teleport to="#search-teleport-target">
    <div class="flex-start gap-sm w-100 flex-wrap">
      <InputsFormInput
        v-model="searchQuery"
        :placeholder="placeholder"
        class="flex-grow-1 min-w-40 col"
        @keyup.enter="handleFilter"
      />
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
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'بحث ...'
  }
})

const emit = defineEmits(['filter', 'reset'])

const searchQuery = ref('')

const handleFilter = () => {
  emit('filter', searchQuery.value.trim())
}

const handleReset = () => {
  searchQuery.value = ''
  emit('reset')
}
</script>