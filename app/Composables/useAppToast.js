import { useToast } from 'primevue/usetoast'

export const useAppToast = () => {
  const toast = useToast()

  const success = (detail) => {
    toast.add({
      severity: 'success',
      detail,
      life: 3000
    })
  }

  const error = (detail = 'حدث خطأ، حاول مرة أخرى', summary = 'خطأ') => {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life: 3000
    })
  }

  const warn = (detail, summary = 'تنبيه') => {
    toast.add({
      severity: 'warn',
      summary,
      detail,
      life: 3000
    })
  }

  const info = (detail, summary = 'معلومة') => {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life: 3000
    })
  }

  return { success, error, warn, info }
}