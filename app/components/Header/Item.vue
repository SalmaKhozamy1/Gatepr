<template>
  <div 
    class="header-box flex-center" 
    :class="{ 'active': active }"
  >
    <!-- Profile Mode -->
    <template v-if="name">
        <div class="flex-between gap-sm">
            <div class="profile-info">
                <p class="username">{{ name }}</p>
            </div>
            <div class="dropdown-arrow flex-center">
                <IconsDownArrow />
            </div>
        </div>
    </template>

    <!-- Action / Nav Mode -->
    <template v-else>
      <div class="flex-center gap-xs">
        <slot />
      </div>
      <span v-if="badge" class="header-badge flex-center">
        {{ badge }}
      </span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: null
  },
  badge: {
    type: [String, Number],
    default: null
  },
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.header-box {
    border-radius: var(--radius-sm);
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(249, 249, 250, 0.05);
    backdrop-filter: blur(16.350000381469727px);
    padding: 8px;
    min-width: 48px;
    min-height: 48px;
    color: #fff;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
}
.header-box:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: var(--secondary-color);
}
.header-box.active {
    background-color: var(--secondary-color);
}

.header-badge {
    position: absolute;
    top: 2px;
    inset-inline-start: 0px;
    background-color: var(--secondary-color);
    color: #fff;
    font-size: var(--size-xs);
    font-weight: 500;
    min-width: 20px;
    height: 20px;
    border-radius: 50%;
}
.username {
    white-space: nowrap;
}
</style>
