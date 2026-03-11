import { ref } from 'vue'
import { useApi } from '~/composables/useApi'

export const useView = () => {

  const api = useApi()

  const loading = ref(false)

  const viewItem = async (endpoint, id) => {
    try {
      loading.value = true
      const res = await api(`/v1/admin/${endpoint}/${id}`)
      return res.data
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    viewItem,
    loading
  }

}