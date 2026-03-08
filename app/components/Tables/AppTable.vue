<template>
  <div class="table-container w-100">
    <div class="table-responsive w-100">
      <table class="custom-table w-100">
        <thead>
          <tr>
            <slot name="header">
               <th v-for="(header, index) in headers" 
                   :key="index" 
                   :class="header.class"
                   scope="col">
                 {{ header.label }}
               </th>
            </slot>
          </tr>
        </thead>
        <tbody>
          <slot name="body"></slot>
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
defineProps({
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
  }
})

defineEmits(['update:currentPage'])
</script>

<style scoped>
.table-responsive {
  overflow: auto;
}
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
  background-color: #F7F7F8;
}
/* Rounded corners for the header row HEAD using logical properties for RTL/LTR support */
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
