export const useSpotlight = () => {
  const config = useRuntimeConfig()
  const results = ref([])
  const loading = ref(false)

  const search = async (term) => {
    if (!term) {
      results.value = []
      return
    }

    loading.value = true

    try {
      const response = await $fetch(
        `${config.public.apiBase}/spotlight`,
        {
          query: { search: term },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      results.value = response.data || response
    } catch (error) {
      console.error('Spotlight Error:', error)
    }

    loading.value = false
  }

  return { results, loading, search }
}