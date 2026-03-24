
<template>
  <aside>
    <CardsCustomCard :title="title">
      <div>
       <PageLayoutSideNavItem
        v-for="(item, index) in items"  
         :key="index"
         :title="item.title"
         :icon="item.icon"
         :active="activeIndex === index"
         @on-click="$emit('item-click', index)">

       </PageLayoutSideNavItem>
      </div>
    </CardsCustomCard>
  </aside>
</template>

<script setup>
const { locale } = useI18n()

defineProps({
  title: {
    type: String,
    default: ""
  },
  items: {
    type: Array,
    default: () => []
  },
  activeIndex: {
    type: Number,
    default: 0
  }
})

defineEmits(['item-click'])
</script>


