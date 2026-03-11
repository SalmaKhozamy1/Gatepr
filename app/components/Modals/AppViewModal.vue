<template>
  <ModalsAppModal
    :model-value="modelValue"
    :title="title"
    :icon="icon"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex-column-start">
      <div class="flex-between gap-md w-100 item_details"
        v-for="field in fields"
        :key="field.key"
      >
        <p>{{ field.label }}</p>
        <h5>{{ getValue(field.key) }}</h5>
      </div>
    </div>
  </ModalsAppModal>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: String,
  data: Object,
  fields: Array,
  icon: Object  
})

const emit = defineEmits(['update:modelValue'])

const getValue = (key) => key.split('.').reduce((o, i) => o?.[i], props.data)
</script>

<style scoped>
.item_details {
  padding: 8px;
}
.item_details:nth-child(even) {
  background-color: var(--light-primary-color);
  border-radius: var(--radius-sm);
}
</style>