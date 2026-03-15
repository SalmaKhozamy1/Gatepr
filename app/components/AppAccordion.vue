<template>
  <div class="accordion-item">
    <h5 class="accordion-header">
      <button
        class="accordion-button flex-start gap-sm"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="'#' + id"
        aria-expanded="true"
        :aria-controls="id"
      >
        <span v-if="icon" class="accordion-icon"><component :is="icon" /></span>

        <!-- ✅ لو في title يعرضه، لو لأ يعرض الـ slot -->
        <span v-if="title">{{ title }}</span>
        <slot v-else name="header" />

      </button>
    </h5>
    <div
      :id="id"
      class="accordion-collapse collapse"
      :class="{ 'show': show }"
      :data-bs-parent="'#' + parentId"
    >
      <div class="accordion-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
  id: { type: String, required: true },
  parentId: { type: String, default: 'accordionExample' },
  title: { type: String, default: '' },
  icon: { type: [Object, Function, String], default: null },
  show: { type: Boolean, default: false }
  })
</script>

<style scoped>
  .accordion-item {
    border-radius: var(--radius-md);
    border: 0px;
    box-shadow: none;
  }
  .accordion-header {
    padding: 0px;
  }
  .accordion-button {
    background-color: #fff;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
    border-bottom: 1px solid #F4F5F6 !important;
  }
  .accordion-button::after {
    margin-inline-start: auto;
    margin-left: unset;
    border-radius: 50%;
    background-position: 50% 50%;
    background-color: var(--light-gray);
    color: var(--gray-color);
    background-size: 14px;
    padding: 13px;
  }
  .accordion-button:focus {
    box-shadow: none;
  }
  .accordion-icon {
    color: var(--gray-color);
  }
</style>