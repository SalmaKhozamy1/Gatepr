<template>
  <div 
    class="side-nav-item" 
    :class="{ 'active': active }"
    @click="$emit('on-click')"
  >
    <div class="content flex-between w-100">
        <p class="title">{{ title }}</p>
        <div class="icon-case flex-center">
            <component :is="icon" v-if="icon" />
            <slot name="icon" v-else />
        </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  icon: { type: [Object, String], default: null },
  active: { type: Boolean, default: false }
})

defineEmits(['on-click'])
</script>

<style scoped>
.side-nav-item {
    padding: 14px 18px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--gray-color);
    margin-bottom: 4px;
}

.side-nav-item:hover {
    background-color: var(--light-primary-color);
    color: var(--primary-color);
}

.side-nav-item.active {
    background-color: #FEF9EE; /* Light variant of secondary color */
    color: var(--secondary-color);
    font-weight: 600;
}

.icon-case {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: transparent;
    transition: inherit;
}

.side-nav-item.active .icon-case {
    background: var(--secondary-color);
}

/* Reach into icon SVG paths automatically */
.side-nav-item :deep(path) {
    stroke: var(--gray-color);
    transition: inherit;
}

.side-nav-item.active :deep(path) {
    stroke: #fff;
    stroke-width: 2px;
}

/* Hover effects for icons */
.side-nav-item:hover :deep(path) {
    stroke: var(--primary-color);
}
</style>
