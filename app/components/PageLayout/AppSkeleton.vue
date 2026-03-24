<template>
  <div class="page-skeleton-wrapper w-100">
    <!-- Header Actions / Breadcrumb Skeleton -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <Skeleton width="30%" height="2rem" />
      <div class="d-flex gap-2">
        <Skeleton width="100px" height="2.5rem" border-radius="8px" />
        <Skeleton width="100px" height="2.5rem" border-radius="8px" />
      </div>
    </div>

    <!-- Search / Filter Card Skeleton -->
    <div v-if="hasSearch" class="search-card-skeleton bg-white rounded-3 p-4 mb-4">
      <Skeleton width="200px" height="1.5rem" class="mb-3" />
      <div class="d-flex gap-3 flex-wrap">
        <Skeleton width="30%" height="2.5rem" border-radius="8px" />
        <Skeleton width="30%" height="2.5rem" border-radius="8px" />
        <Skeleton width="20%" height="2.5rem" border-radius="8px" />
      </div>
    </div>

    <!-- Main Content / Table Skeleton -->
    <div class="main-content-skeleton bg-white rounded-3 p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <Skeleton width="25%" height="1.8rem" />
        <Skeleton width="10%" height="2rem" border-radius="8px" />
      </div>

      <!-- Table Header Skeleton -->
      <div class="d-flex justify-content-between mb-3 border-bottom pb-3">
        <Skeleton v-for="i in columns" :key="'th-'+i" :width="100/columns - 2 + '%'" height="1.5rem" />
      </div>

      <!-- Table Rows Skeleton -->
      <div class="d-flex flex-column gap-3">
        <div v-for="row in rows" :key="'row-'+row" class="d-flex justify-content-between border-bottom pb-3">
          <Skeleton v-for="i in columns" :key="'td-'+i" :width="100/columns - 2 + '%'" height="1.2rem" />
        </div>
      </div>
      
      <!-- Pagination Skeleton -->
      <div class="d-flex justify-content-between align-items-center mt-4 pt-2">
        <Skeleton width="20%" height="1.5rem" />
        <div class="d-flex gap-2">
          <Skeleton width="2rem" height="2rem" shape="circle" />
          <Skeleton width="2rem" height="2rem" border-radius="8px" />
          <Skeleton width="2rem" height="2rem" border-radius="8px" />
          <Skeleton width="2rem" height="2rem" shape="circle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hasSearch: {
    type: Boolean,
    default: true
  },
  rows: {
    type: Number,
    default: 5
  },
  columns: {
    type: Number,
    default: 6
  }
})
</script>

<style scoped>
.page-skeleton-wrapper {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
