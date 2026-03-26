<template>
  <PageLayout
    :hasAside="false"
    formTitle="سجل الأصناف"
  >
    <!-- Search / Filter -->
    <template #search>
      <SearchBar
        placeholder="بحث .."
        :filters="searchFilters"
        :loading="loading"
        @filter="handleFilter"
        @reset="resetFilters"
      />
    </template>

    <!-- Header Actions -->
    <template #header-actions>
        <div  class="flex-start gap-sm">
            <button class="custom-btn gray-btn">
                <span style="font-size: 20px">+</span> إستيراد
            </button>
            <button class="custom-btn primary-btn" @click="$router.push(localePath('/item-managment/add'))">
                <span style="font-size: 20px">+</span> إنشاء طلب أصناف
            </button>
        </div>
    </template>

    <!-- Table content -->
    <template #main>
        <TablesAppTable
          :headers="headers"
          :current-page="1"
          :total-pages="1"
          :per-page="10"
          :loading="loading"
          @update:current-page="() => {}"
        >
          <template #body="{ getIndex }">
            <tr v-for="(item, index) in itemsList" :key="index">
              <th class="index-cell">{{ index + 1 }}</th>
              <td>{{ item.requestNumber }}</td>
              <td>{{ item.itemName }}</td>
              <td>{{ item.itemNumber }}</td>
              <td>{{ item.category }}</td>
              <td>
                <span class="status-token" :class="getStatusClass(item.status)">
                  {{ getStatusText(item.status) }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="d-flex align-items-center gap-2">
                  <button v-if="item.status === 'accepted'" class="action-btn view" title="تنزيل">
                    <IconsDownload width="18" height="18" />
                  </button>
                  <button v-if="item.status !== 'rejected'" class="action-btn delete" title="حذف">
                    <IconsDelete width="18" height="18" />
                  </button>
                  <button v-if="item.status !== 'rejected'" class="action-btn edit" title="تعديل">
                    <IconsEdit width="18" height="18" />
                  </button>
                  <button class="action-btn view" title="عرض">
                    <IconsEye width="18" height="18" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </TablesAppTable>
    </template>
  </PageLayout>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
// Will highlight menu if matching this route eventually
usePageMeta('menu.item-managment')

const loading = ref(false)
const localePath = useLocalePath()

const searchFilters = computed(() => [
  {
    key: 'category_id',
    placeholder: 'التصنيفات',
    options: [{ label: 'ألبان', value: 'dairy' }] // mock
  },
  {
    key: 'status',
    placeholder: 'حالة الطلب',
    options: [
      { label: 'قيد الإنتظار', value: 'pending' },
      { label: 'مقبول', value: 'accepted' },
      { label: 'مرفوض', value: 'rejected' }
    ]
  }
])

const headers = computed(() => [
  { label: '#', class: 'index-cell' },
  { label: 'رقم الطلب', class: '' },
  { label: 'اسم الصنف', class: '' },
  { label: 'رقم الصنف', class: '' },
  { label: 'التصنيف', class: '' },
  { label: 'حالة الطلب', class: '' },
  { label: 'الإجراءات', class: 'actions-cell' }
])

// Mocked Data array matching screen
const itemsList = ref([
  { requestNumber: '165545', itemName: 'حليب', itemNumber: '165545', category: 'ألبان', status: 'pending' },
  { requestNumber: '165545', itemName: 'كاكاو', itemNumber: '165545', category: 'ألبان', status: 'pending' },
  { requestNumber: '165545', itemName: 'زيت', itemNumber: '165545', category: 'ألبان', status: 'accepted' },
  { requestNumber: '165545', itemName: 'حليب', itemNumber: '165545', category: 'ألبان', status: 'accepted' },
  { requestNumber: '165545', itemName: 'كاكاو', itemNumber: '165545', category: 'ألبان', status: 'accepted' },
  { requestNumber: '165545', itemName: 'زيت', itemNumber: '165545', category: 'ألبان', status: 'accepted' },
  { requestNumber: '165545', itemName: 'حليب', itemNumber: '165545', category: 'ألبان', status: 'rejected' }
])

const handleFilter = (filters) => {
  console.log('Filter applied', filters)
}

const resetFilters = () => {
  console.log('Reset form')
}

// Helpers
const getStatusClass = (status) => {
  if (status === 'pending') return 'status-pending'
  if (status === 'accepted') return 'status-accepted'
  if (status === 'rejected') return 'status-rejected'
}

const getStatusText = (status) => {
  if (status === 'pending') return 'قيد الإنتظار'
  if (status === 'accepted') return 'مقبول'
  if (status === 'rejected') return 'مرفوض'
}
</script>

<style scoped>
.status-token {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}
.status-pending {
  color: #F0BA3E;
  background-color: #FFF9F0;
  border: 1px solid #F0BA3E;
}
.status-accepted {
  color: #02C697;
  background-color: #E6F9F5;
  border: 1px solid #02C697;
}
.status-rejected {
  color: #F3616A;
  background-color: #FEF0F1;
  border: 1px solid #F3616A;
}
.action-btn {
  background: transparent;
  border: none;
  color: #98A2B3;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.action-btn:hover {
  color: var(--primary-color);
}
</style>