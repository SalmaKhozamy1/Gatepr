<template>
  <div :class="['gap-md', hasAside ? 'side-page-layout grid grid-2' : 'flex-column']">
      <PageLayoutAsideContent
      v-if="hasAside"
      :title="asideTitle"
      :items="asideItems"
      :activeIndex="activeIndex"
      @item-click="$emit('item-click', $event)"
      />
      <div class="d-flex flex-column gap-md">
        <CardsCustomCard v-if="hasSearch" :title="t('pages.search_filter')">
          <slot name="search"></slot>
        </CardsCustomCard>

        <page-layout-main-content :Title="formTitle">
            <template #actions v-if="$slots['header-actions']">
                <slot name="header-actions" />
            </template>
            <slot name="main" />
        </page-layout-main-content>
      </div>
   
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n() 

defineProps({
   hasSearch: {
    type: Boolean,
    default: true   
  },
   hasAside: {
    type: Boolean,
    default: true  
  },
  asideTitle: {
    type: String,
    default: ""
  }, 
  asideItems:{
    type:Array,
    default: () => []
  },
  activeIndex: {
    type: Number,
    default: 0
  }, 
  formTitle: {
    type: String,
    default: ""
  }
})

defineEmits(['item-click'])
</script>

<style scoped>
.side-page-layout {
  grid-template-columns: .25fr 1fr;
}

/* Responsive handling */
@media (max-width: 576px) {
  .side-page-layout {
    grid-template-columns: 100%;
  }
}
</style>
