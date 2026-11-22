// Mirror AUDIT_ACTIONS di presensi-app/apps/api/src/modules/audit_logs/audit_logs.model.js.
// Kalau backend tambah action baru, update list ini.
export const AUDIT_ACTIONS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_TOGGLED_ACTIVE: 'user.toggled_active',
  USER_PASSWORD_RESET: 'user.password_reset',
  PERMISSION_APPROVED: 'permission.approved',
  PERMISSION_REJECTED: 'permission.rejected',
  PERMISSION_CANCELLED: 'permission.cancelled',
  ATTENDANCE_MANUAL_CREATED: 'attendance.manual_created',
  LEAVE_BALANCE_CREATED: 'leave_balance.created',
  LEAVE_BALANCE_UPDATED: 'leave_balance.updated',
} as const

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS]

// Label & color category untuk dropdown filter + badge di tabel.
export const AUDIT_ACTION_META: Record<
  string,
  { label: string; color: string }
> = {
  'user.created': {
    label: 'User Logs',
    color: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200',
  },
  'user.updated': {
    label: 'User Updated',
    color: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200',
  },
  'user.password_reset': {
    label: 'Password Reset',
    color: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  },
  'permission.cancelled': {
    label: 'Permission Cancelled',
    color: 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-200',
  },
  'user.toggled_active': {
    label: 'User Toggled',
    color: 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-200',
  },
  'permission.approved': {
    label: 'Permission Approved',
    color: 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200',
  },
  'permission.rejected': {
    label: 'Permission Rejected',
    color: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200',
  },
  'attendance.manual_created': {
    label: 'Manual Attendance',
    color:
      'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
  },
  'leave_balance.created': {
    label: 'Leave Balance Created',
    color:
      'bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200',
  },
  'leave_balance.updated': {
    label: 'Leave Balance Updated',
    color:
      'bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200',
  },
}

export interface AuditLogUser {
  id: string
  fullName: string
  employeeId: string
  email: string
  role: string
}

export interface AuditLog {
  id: string
  userId: string | null
  action: AuditAction | string
  details: string | null
  createdAt: string
  user: AuditLogUser | null
}

export interface AuditLogListResponse {
  success: boolean
  message: string
  data: AuditLog[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
