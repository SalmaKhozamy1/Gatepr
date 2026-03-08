export const useSpotlight = () => {

  const api = useApi()

  const results = ref([])
  const loading = ref(false)

  const search = async (term) => {

    if (!term) {
      results.value = []
      return
    }

    loading.value = true

    try {

      const response = await api('/spotlight', {
        query: { search: term }
      })

      results.value = response.data || response

    } catch (error) {
      console.error('Spotlight Error:', error)
    }

    loading.value = false
  }

  return {
    results,
    loading,
    search
  }
}