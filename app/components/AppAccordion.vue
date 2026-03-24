<template>
  <div class="accordion-item">
    <h5 class="accordion-header">
      <div class="accordion-header-content flex-between">
        <!-- Main Toggle Area (Icon + Title/Header Slot) -->
        <div 
          class="accordion-trigger flex-start gap-sm flex-grow-1"
          @click="toggleCollapse"
          style="cursor: pointer; padding: 12px 16px;"
        >
          <span v-if="icon" class="accordion-icon"><component :is="icon" /></span>
          <span v-if="title" class="accordion-title">{{ title }}</span>
          <div v-else class="header-slot-wrapper" @click.stop>
            <slot name="header" />
          </div>
        </div>

        <!-- Arrow Trigger -->
        <button
          class="accordion-button-custom"
          type="button"
          @click="toggleCollapse"
          :aria-expanded="isExpanded"
          :class="{ 'collapsed': !isExpanded }"
        >
        </button>
      </div>
    </h5>

    <div
      :id="id"
      class="accordion-collapse collapse"
      :class="{ 'show': isExpanded }"
    >
      <div class="accordion-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  parentId: { type: String, default: 'accordionExample' },
  title: { type: String, default: '' },
  icon: { type: [Object, Function, String], default: null },
  show: { type: Boolean, default: false }
})

const isExpanded = ref(props.show)

const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value
}

watch(() => props.show, (newVal) => {
  isExpanded.value = newVal
})
</script>

<style scoped>
  .accordion-item {
    border-radius: var(--radius-md);
    border: 1px solid #F4F5F6;
    box-shadow: none;
    overflow: hidden;
    background-color: #fff;
  }
  .accordion-header {
    padding: 0px;
    background-color: #fff;
    border-bottom: 1px solid #F4F5F6;
  }
  .accordion-header-content {
    min-height: 56px;
  }
  .accordion-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-color);
  }
  .accordion-button-custom {
    all: unset;
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin-inline: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .accordion-button-custom::after {
    content: "";
    width: 12px;
    height: 12px;
    border-right: 2px solid var(--gray-color);
    border-bottom: 2px solid var(--gray-color);
    transform: rotate(45deg);
    transition: transform 0.3s ease;
    margin-top: -6px;
  }
  .accordion-button-custom:not(.collapsed)::after {
    transform: rotate(-135deg);
    margin-top: 6px;
  }
  .accordion-icon {
    color: var(--gray-color);
    display: flex;
    align-items: center;
  }
  .header-slot-wrapper {
    width: 100%;
  }
</style>