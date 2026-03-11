<template>
  <div>
    <Teleport to="#search-teleport-target">
      <div class="flex-start gap-sm w-100 flex-wrap">
        <InputsFormInput 
          v-model="searchQuery"
          placeholder="بحث عن محافظة .." 
          class="flex-grow-1 min-w-40 col"
        />
        <div class="flex-start gap-sm">
          <button class="custom-btn primary-btn min-btn-width fltr_btn" @click="handleFilter">
            <IconsSearch />
            <span>بحث</span>
          </button>
          <ButtonsResetButton @reset="resetFilters" />
        </div>
      </div>
    </Teleport>

    <TablesAppTable 
      :headers="headers"
      :current-page="currentPage"
      :total-pages="totalPages"
      @update:current-page="currentPage = $event"
    >
      <template #body>
        <tr v-for="i in 6" :key="i">
          <th class="index-cell">{{ i }}</th>
          <td>حليب </td>
           <td>67674 </td>
          <td class="actions-cell">
            <div>
              <button class="action-btn view" title="عرض">
                <IconsEye width="18" height="18" />
              </button>
              <button class="action-btn edit" title="تعديل">
                <IconsEdit width="18" height="18" />
              </button>
              <button class="action-btn delete" title="حذف">
                <IconsDelete width="18" height="18" />
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TablesAppTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const handleFilter = () => {
    console.log('Search Governorates:', searchQuery.value)
}

const resetFilters = () => {
    searchQuery.value = ''
    console.log('Filters reset')
}

const currentPage = ref(1)
const totalPages = ref(10)

const headers = [
  { label: '#', class: 'index-cell' },
  { label: 'اسم التصنيف', class: '' },
  { label: 'الكود', class: '' },
  { label: 'الإجراءات', class: 'actions-cell' }
]
</script>

