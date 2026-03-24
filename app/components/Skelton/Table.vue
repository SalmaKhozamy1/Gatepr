<template>
  <div class="table-container w-100 skeleton-table">
    <div class="table-responsive w-100">
      <table class="custom-table w-100">
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="'skel-th-' + index" :class="header.class">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="'skel-tr-' + r">
            <td v-for="(header, index) in headers" :key="'skel-td-' + index" :class="header.class">
              <Skeleton width="100%" height="1.5rem" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Number,
    default: 5
  }
})
</script>

<style scoped>
.skeleton-table {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Matching the AppTable styles */
.table-responsive {
  overflow: auto;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.custom-table th,
.custom-table td {
  padding: 13px 16px;
  text-align: start;
}

.custom-table th {
  color: #667085;
  font-size: var(--size-sm);
  font-weight: 500;
}

.custom-table td {
  font-size: var(--size-sm);
  font-weight: 400;
}

.custom-table tbody tr:not(:last-child) td,
.custom-table tbody tr:not(:last-child) th {
  border-bottom: 1px solid #E9EAEB;
}

.custom-table thead th {
  white-space: nowrap;
  background-color: #F7F7F8;
}

.custom-table thead th:first-child {
  border-start-start-radius: var(--radius-md);
  border-end-start-radius: var(--radius-md);
}

.custom-table thead th:last-child {
  border-start-end-radius: var(--radius-md);
  border-end-end-radius: var(--radius-md);
}

html[dir="rtl"] .custom-table thead th:first-child {
  border-start-start-radius: var(--radius-md);
  border-end-start-radius: var(--radius-md);
}

html[dir="rtl"] .custom-table thead th:last-child {
  border-start-end-radius: var(--radius-md);
  border-end-end-radius: var(--radius-md);
}
</style>
