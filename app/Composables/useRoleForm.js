import { ref, reactive, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

export const useRoleForm = (mode = 'create') => {
  const api = useApi()
  const { success, error: toastError } = useAppToast()
  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const localePath = useLocalePath()

  const id = route.params.id
  const loading = ref(false)
  const savingGroup = ref(null)
  const errors = ref({})
  const selectedPermissions = ref([])
  const permissionGroups = ref([])

  const createdId = ref(null)
  const roleData = reactive({
    name: { ar: '', en: '' }
  })

  /* =============================
     FETCH DATA
  ============================== */
  const fetchPermissions = async () => {
    try {
      const res = await api('/v1/admin/permissions')
      if (res?.data) permissionGroups.value = res.data
    } catch (err) {
      console.error('Error fetching permissions:', err)
    }
  }

  const fetchRoleDetails = async () => {
    if (!id) return
    try {
      loading.value = true
      const res = await api(`/v1/admin/roles/${id}`)
      if (res?.data) {
        const data = res.data
        // ✅ Map localized name properly from all common formats
        if (data.name_localized) {
          roleData.name.ar = data.name_localized.ar || data.name_ar || ''
          roleData.name.en = data.name_localized.en || data.name_en || ''
        } else if (typeof data.name === 'object' && data.name !== null) {
          roleData.name.ar = data.name.ar || ''
          roleData.name.en = data.name.en || ''
        } else {
          roleData.name.ar = data.name_ar || data.name || ''
          roleData.name.en = data.name_en || data.name || ''
        }
        
        selectedPermissions.value = data.permissions?.map(p => p.id) || []
      }
    } catch (err) {
      toastError(t('errors.somethingWentWrong'))
    } finally {
      loading.value = false
    }
  }

  /* =============================
     HANDLERS
  ============================== */
const handleSaveName = async () => {
  if (!roleData.name.ar || !roleData.name.en) {
    toastError(t('errors.pleaseFillAllFields'))
    return
  }

  loading.value = true
  try {
    // ✅ لو سبق واتخلق استخدم الـ id بتاعه
    const endpoint = createdId.value 
      ? `/v1/admin/roles/${createdId.value}`
      : mode === 'create' ? '/v1/admin/roles' : `/v1/admin/roles/${id}`

    const method = createdId.value 
      ? 'PUT' 
      : mode === 'create' ? 'POST' : 'PUT'

    const res = await api(endpoint, {
      method,
      body: { 
        name: roleData.name, 
        permissions: selectedPermissions.value // ✅ مش [] ثابتة
      }
    })

    // ✅ احتفظ بالـ id اللي رجع من الـ create
    if (mode === 'create' && !createdId.value && res?.data?.id) {
      createdId.value = res.data.id
    }

    const msg = mode === 'create' 
      ? t('messages.added_successfully', { item: t('labels.role') })
      : t('messages.updated_successfully', { item: t('labels.role') })
      
    success(msg)

  } catch (err) {
    if (err?.data?.errors) errors.value = err.data.errors
    toastError(err?.data?.message || t('errors.somethingWentWrong'))
  } finally {
    loading.value = false
  }
}

  const handleSaveGroup = async ({ groups }) => {
    if (!roleData.name.ar || !roleData.name.en) {
      toastError(t('errors.pleaseFillAllFields'))
      return
    }

    try {
      loading.value = true
      const roleId = createdId.value || id || ''
      
      await api(`/v1/admin/roles/${roleId}`, {
        method: (mode === 'create' && !createdId.value) ? 'POST' : 'PUT',
        body: {
          name: roleData.name,
          permissions: selectedPermissions.value
        }
      })
      success(t('messages.updated_successfully', { item: t('labels.role') }))
    } catch (err) {
      toastError(err?.data?.message || t('errors.somethingWentWrong'))
    } finally {
      loading.value = false
    }
  }

  const handleCancel = () => router.push(localePath('/settings/roles'))

onMounted(async () => {
  await fetchPermissions()
  if (mode !== 'create' && id) {
    await fetchRoleDetails() 
  }
})

  return {
    roleData,
    permissionGroups,
    selectedPermissions,
    loading,
    savingGroup,
    errors,
    handleSaveName,
    handleSaveGroup,
    handleCancel
  }
}
