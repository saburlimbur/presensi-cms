import ApiService from '@/lib/axios'
import type {
  MarkAllReadResponse,
  MarkReadResponse,
  NotificationListResponse,
  UnreadCountResponse,
} from '../data/schema'

export interface ListNotificationsParams {
  page?: number
  limit?: number
  unreadOnly?: boolean
  type?: string
}

export const notificationsService = {
  list: async (params?: ListNotificationsParams) => {
    const res = await ApiService.get<NotificationListResponse>(
      '/notifications',
      { params }
    )
    return res.data
  },

  unreadCount: async () => {
    const res = await ApiService.get<UnreadCountResponse>(
      '/notifications/unread-count'
    )
    return res.data
  },

  markRead: async (id: string) => {
    const res = await ApiService.patch<MarkReadResponse>(
      `/notifications/${id}/read`
    )
    return res.data
  },

  markAllRead: async () => {
    const res = await ApiService.patch<MarkAllReadResponse>(
      '/notifications/read-all'
    )
    return res.data
  },
}
