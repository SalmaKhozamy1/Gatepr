<template>
  <div class="spotlight">
    <input v-model="searchInput" placeholder="ابحث..." />

    <div v-if="loading">Loading...</div>

    <div v-if="results.length">
      <div v-for="item in results" :key="item.id">
        <NuxtLink :to="item.url">
          <h4>{{ item.title }}</h4>
          <p>{{ item.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSpotlight } from '@/composables/useSpotlight'

const searchInput = ref('')
const { results, loading, search } = useSpotlight()

let timeout = null

watch(searchInput, (value) => {
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    search(value)
  }, 400)
})
</script>