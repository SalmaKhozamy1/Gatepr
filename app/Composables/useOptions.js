import { ref } from 'vue'
import { useApi } from '~/composables/useApi'

export const useOptions = () => {
  const api = useApi()

  const governorateOptions = ref([])
  const roleOptions = ref([])
  const branchOptions = ref([])

  const fetchGovernorates = async () => {
    try {
      const res = await api('/admin/governorates?per_page=100')
      governorateOptions.value = (res.data || []).map(item => ({
        label: item.name?.ar,
        value: item.id
      }))
    } catch (err) {
      console.error('Error fetching governorate options:', err)
    }
  }

  const fetchRoles = async () => {
    try {
      const res = await api('/admin/roles?per_page=100')
      roleOptions.value = (res.data || []).map(item => ({
        label: item.name?.ar || item.name,
        value: item.id
      }))
    } catch (err) {
      console.error('Error fetching role options:', err)
    }
  }

  const fetchBranches = async () => {
    try {
      const res = await api('/admin/branches?per_page=100')
      branchOptions.value = (res.data || []).map(item => ({
        label: item.name?.ar || item.name,
        value: item.id
      }))
    } catch (err) {
      console.error('Error fetching branch options:', err)
    }
  }

  return {
    governorateOptions,
    roleOptions,
    branchOptions,
    fetchGovernorates,
    fetchRoles,
    fetchBranches,
  }
}