import { useQuery } from '@tanstack/react-query'
import { notificationsService } from '../api/notifications.service'

export default function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res = await notificationsService.unreadCount()
      return res.data.unread
    },
    // Source of truth untuk badge. SSE event invalidate query ini supaya
    // count selalu re-fetched dari server (tidak drift).
    staleTime: 0,
  })
}
