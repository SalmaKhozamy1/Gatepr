<template>
  <div 
    class="side-nav-item" 
    :class="{ 'active': active }"
    @click="$emit('on-click')"
  >
    <div class="content flex-start gap-sm w-100">
        <div class="icon-case flex-center">
            <component :is="icon" v-if="icon" />
            <slot name="icon" v-else />
        </div>
        <h5 class="title">{{ title }}</h5>
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
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 4px;
    position: relative;
    overflow: hidden;
}
.icon-case {    
    color: var(--placeholder);
}
.side-nav-item:hover {
    background-color: var(--light-secondary-color);
    color: var(--secondary-color);
}
.side-nav-item:hover .icon-case ,
.side-nav-item.active .icon-case {
    color: var(--secondary-color);
}
.side-nav-item.active {
    background-color: var(--light-secondary-color);
    color: var(--secondary-color);
}
.side-nav-item.active::before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    inset-inline-start: -2px;
    width: 5px;
    border-radius: 30px;
    height: 67%;
    background-color: var(--secondary-color);
}
.icon-case {
    width: 24px;
    height: 24px;
}
</style>
