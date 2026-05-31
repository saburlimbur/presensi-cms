// Mirror NotificationType di prisma/schema.prisma (absensi-server).
// Kalau backend tambah enum baru, update list ini.
export const NOTIFICATION_TYPES = [
  'ATTENDANCE_REMINDER',
  'ATTENDANCE_CHECK_IN',
  'ATTENDANCE_CHECK_OUT',
  'PERMISSION_SUBMITTED',
  'PERMISSION_APPROVED',
  'PERMISSION_REJECTED',
  'ANNOUNCEMENT',
  'SYSTEM',
] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export interface NotificationDataPermission {
  permissionId?: string
  userId?: string
  type?: string
  status?: 'APPROVED' | 'REJECTED'
}

export interface NotificationDataAttendance {
  attendanceId?: string
  userId?: string
  status?: string
  workMode?: 'WFO' | 'WFA'
  checkInAt?: string
  checkOutAt?: string
}

export type NotificationData =
  | NotificationDataPermission
  | NotificationDataAttendance
  | Record<string, unknown>

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  data: NotificationData | null
  readAt: string | null
  createdAt: string
}

// Payload SSE summary dari notifyAllAdmins — tidak punya id/readAt
// (1 emit fan-out ke N admin, tiap admin punya row sendiri di DB).
export interface AdminEventPayload {
  type: NotificationType
  title: string
  body: string
  data: NotificationData | null
  createdAt: string
}

export const ADMIN_EVENT_NAMES = [
  'permission:submitted',
  'permission:cancelled',
  'attendance:checked_in',
  'attendance:checked_out',
] as const

export type AdminEventName = (typeof ADMIN_EVENT_NAMES)[number]

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export interface NotificationListResponse extends ApiEnvelope<Notification[]> {
  pagination: {
    total: number
    page: number
    limit: number
    totalPage: number
  }
}

export type UnreadCountResponse = ApiEnvelope<{ unread: number }>
export type MarkReadResponse = ApiEnvelope<Notification>
export type MarkAllReadResponse = ApiEnvelope<{ updated: number }>
