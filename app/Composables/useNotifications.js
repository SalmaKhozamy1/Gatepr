import { ref, computed } from 'vue'

export const useNotifications = () => {
  const api = useApi()

  const notifications = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const perPage = ref(15)
  const totalCount = ref(0)

  const role = useCookie('role')

  /**
   * Parse the meta object from the API response.
   * The API may return arrays for some values, so we normalise them.
   */
  const parseMeta = (meta = {}) => {
    const getValue = (val) => {
      if (Array.isArray(val)) return val[0] ?? 1
      return val ?? 1
    }
    return {
      lastPage: getValue(meta.last_page),
      currentPage: getValue(meta.current_page),
      total: getValue(meta.total),
    }
  }

  /**
   * Fetch notifications from the API
   * @param {Object} options - Optional overrides
   * @param {number} options.page - Page number
   * @param {number} options.per_page - Items per page (1-100)
   * @param {string} options.search - Search term
   * @param {string} options.sort - Sort field (prefix with - for desc)
   * @param {string} options.with - Comma-separated relations to eager load
   */
  const fetchNotifications = async (options = {}) => {
    try {
      loading.value = true

      const params = new URLSearchParams()
      params.append('page', options.page ?? currentPage.value)
      params.append('per_page', options.per_page ?? perPage.value)

      // Default sort by newest first
      const sort = options.sort ?? '-created_at'
      params.append('sort', sort)

      if (options.search?.trim()) {
        params.append('search', options.search.trim())
      }

      if (options.with) {
        params.append('with', options.with)
      }

      const currentRole = role.value;
      let endpoint = '/v1/admin/notifications'

      if (currentRole === 'supplier') {
        endpoint = '/notifications'
      }

      const res = await api(`${endpoint}?${params}`)

      notifications.value = res.data || []

      const meta = parseMeta(res.meta)
      totalPages.value = meta.lastPage
      totalCount.value = meta.total
      if (currentPage.value > meta.lastPage) currentPage.value = 1

    } catch (err) {
      console.error('Error fetching notifications:', err)
      notifications.value = []
      totalPages.value = 1
      totalCount.value = 0
    } finally {
      loading.value = false
    }
  }

  /**
   * Go to a specific page
   */
  const goToPage = (page) => {
    const safePage = Math.max(1, Math.min(page, totalPages.value))
    if (safePage === currentPage.value) return
    currentPage.value = safePage
    fetchNotifications()
  }

  /**
   * Count of unread notifications (if the API provides a read/unread flag)
   */
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read_at).length
  })

  /**
   * Mark all notifications as read for the current auth user
   * POST /v1/admin/mark-as-read
   */
  const markingAllRead = ref(false)

  const markAllAsRead = async () => {
    try {
      markingAllRead.value = true
      await api('/v1/admin/mark-as-read', { method: 'POST' })
      // Update local state immediately
      notifications.value.forEach(n => {
        if (!n.read_at) n.read_at = new Date().toISOString()
      })
    } catch (err) {
      console.error('Error marking notifications as read:', err)
      throw err
    } finally {
      markingAllRead.value = false
    }
  }

  return {
    notifications,
    loading,
    currentPage,
    totalPages,
    perPage,
    totalCount,
    unreadCount,
    markingAllRead,
    fetchNotifications,
    markAllAsRead,
    goToPage,
  }
}
