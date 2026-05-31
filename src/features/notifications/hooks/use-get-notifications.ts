import { useQuery } from '@tanstack/react-query'
import {
  notificationsService,
  type ListNotificationsParams,
} from '../api/notifications.service'

export default function useGetNotifications(params?: ListNotificationsParams) {
  return useQuery({
    queryKey: ['notifications', 'list', params],
    queryFn: () => notificationsService.list(params),
    // Pendek aja — SSE event akan invalidate untuk realtime sync
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
  })
}
