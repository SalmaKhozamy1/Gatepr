import { ref } from 'vue'
import { useApi } from '~/composables/useApi'

export const useView = () => {

  const api = useApi()
  const role = useCookie('role')

  const loading = ref(false)

  const viewItem = async (endpoint, id) => {
    try {
      loading.value = true
      const url = role.value === 'admin'
        ? `/v1/admin/${endpoint}/${id}`
        : `/${endpoint}/${id}`
      const res = await api(url)
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