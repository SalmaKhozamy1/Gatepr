<template>
  <div class="table-container w-100 position-relative">
    
    <!-- ✅ Loading Overlay -->
    <div v-if="loading" class="table-loading-overlay">
      <span class="premium-spinner"></span>
    </div>

    <div class="table-responsive w-100">
      <table class="custom-table w-100">
        <thead>
          <tr>
            <slot name="header">
              <th
                v-for="(header, index) in headers"
                :key="index"
                :class="header.class"
                scope="col"
              >
                {{ header.label }}
              </th>
            </slot>
          </tr>
        </thead>
        <tbody>
          <slot name="body" :getIndex="getIndex"></slot>
        </tbody>
      </table>
    </div>

    <Pagination
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @update:current-page="$emit('update:currentPage', $event)"
    />

  </div>
</template>

<script setup>
const props = defineProps({
  headers: {
    type: Array,
    default: () => []
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  perPage: {
    type: Number,
    default: 15
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:currentPage'])

// ✅ بيحسب الرقم التسلسلي عبر الصفحات
const getIndex = (i) => (props.currentPage - 1) * props.perPage + i + 1
</script>

<style scoped>

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.custom-table :deep(th),
.custom-table :deep(td) {
  padding: 13px 16px;
  text-align: start;
}

.custom-table :deep(th) {
  color: #667085;
  font-size: var(--size-sm);
  font-weight: 500;
}

.custom-table :deep(td) {
  font-size: var(--size-sm);
  font-weight: 400;
}

.custom-table tbody :deep(tr:not(:last-child) td),
.custom-table tbody :deep(tr:not(:last-child) th) {
  border-bottom: 1px solid #E9EAEB;
}

.custom-table thead th {
  white-space: nowrap;
  background-color: #F7F7F8;
}

.custom-table :deep(thead th:first-child) {
  border-start-start-radius: var(--radius-md);
  border-end-start-radius: var(--radius-md);
}

.custom-table :deep(thead th:last-child) {
  border-start-end-radius: var(--radius-md);
  border-end-end-radius: var(--radius-md);
}

html[dir="rtl"] .custom-table :deep(thead th:first-child) {
  border-start-start-radius: var(--radius-md);
  border-end-start-radius: var(--radius-md);
}

html[dir="rtl"] .custom-table :deep(thead th:last-child) {
  border-start-end-radius: var(--radius-md);
  border-end-end-radius: var(--radius-md);
}
</style>