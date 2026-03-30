import { ref } from 'vue'

export const useSearchFilter = (fetchFn) => {
  const loading = ref(true)
  const searchQuery = ref('')
  const currentPage = ref(1)
  const totalPages = ref(1)

  const handleFilter = ({ search, ...filters } = {}) => {
    searchQuery.value = (search || '').toLowerCase()
    
    currentPage.value = 1
    fetchFn()
  }

  const handleReset = (resetFieldsFunc) => {
    searchQuery.value = ''
    currentPage.value = 1
    if (resetFieldsFunc) resetFieldsFunc()
    fetchFn()
  }

  return {
    loading,
    searchQuery,
    currentPage,
    totalPages,
    handleFilter,
    handleReset
  }
}
