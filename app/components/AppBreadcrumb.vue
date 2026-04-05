<template>
  <nav class="breadcrumb-nav" aria-label="breadcrumb">
    <ol class="breadcrumb mb-0">
      <li class="breadcrumb-item">
        <NuxtLink :to="localePath('/')" class="breadcrumb-link">
          {{ t('menu.home') }}
        </NuxtLink>
      </li>
      <li 
        v-for="(crumb, index) in breadcrumbs" 
        :key="index" 
        class="breadcrumb-item"
        :class="{ active: index === breadcrumbs.length - 1 }"
        :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
      >
        <NuxtLink 
          v-if="index < breadcrumbs.length - 1" 
          :to="localePath(crumb.path)" 
          class="breadcrumb-link"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="breadcrumb-current">{{ crumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const breadcrumbs = computed(() => {
  const fullPath = route.path
  // Remove trailing slashes and locale prefixes if any (strategy: 'prefix_except_default')
  // i18n handle locale prefixes in path usually.
  // We can just split by '/' and filter out empty strings.
  const segments = fullPath.split('/').filter(p => p && p !== 'ar' && p !== 'en')
  
  const crumbs = []
  let currentPath = ''

  segments.forEach((segment) => {
    currentPath += `/${segment}`

    // Skip segments that represent numeric IDs
    if (isNaN(segment)) {
      let label = segment

      // Heuristic for translation key
      if (t(`menu.${segment}`) !== `menu.${segment}`) {
        label = t(`menu.${segment}`)
      } else if (t(`settings.${segment}`) !== `settings.${segment}`) {
        label = t(`settings.${segment}`)
      } else if (t(`common.${segment}`) !== `common.${segment}`) {
        label = t(`common.${segment}`)
      } else if (segment === 'add') {
        label = t('common.add')
      } else if (segment === 'edit') {
        label = t('common.edit')
      } else if (segment === 'profile') {
        label = t('menu.supplier_profile')
      } else if (segment === 'terms-and-condition') {
        label = t('menu.terms_and_conditions')
      }

      crumbs.push({
        label,
        path: currentPath
      })
    }
  })

  // ✅ Force localization of the last segment if page-level title is registered via usePageMeta
  // if (crumbs.length > 0 && route.meta.title) {
  //   crumbs[crumbs.length - 1].label = t(route.meta.title)
  // }
  
  return crumbs
})
</script>

<style scoped>
.breadcrumb-nav {
  display: flex;
  align-items: center;
}

.breadcrumb {
  background: transparent;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "/";
  padding: 0 8px;
  color: rgba(255, 255, 255, 0.70);
}

[dir="rtl"] .breadcrumb-item + .breadcrumb-item::before {
  content: "/";
  transform: scaleX(-1);
}
.breadcrumb-current {
  color: #fff !important;
  font-size: var(--size-xs);
  font-weight: 500;
}
.breadcrumb-link {
  font-size: var(--size-xs);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.70);
  text-decoration: none;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.me-1 {
  margin-inline-end: 4px;
}
.breadcrumb-item+.breadcrumb-item {
  padding: 0px !important;
}
</style>
