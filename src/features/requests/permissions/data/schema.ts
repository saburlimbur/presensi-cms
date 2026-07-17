import { z } from 'zod'

// Mirror PERMISSION_TYPES di backend permission.model.js.
export const permissionTypeEnum = z.enum([
  'SICK',
  'PERMIT',
  'ANNUAL_LEAVE',
  'MATERNITY_LEAVE',
  'PATERNITY_LEAVE',
  'MARRIAGE_LEAVE',
  'BEREAVEMENT',
  'HALF_DAY',
  'WORK_FROM_HOME',
  'OTHER',
])
export type PermissionType = z.infer<typeof permissionTypeEnum>

export const PERMISSION_TYPE_OPTIONS: { label: string; value: PermissionType }[] = [
  { label: 'Sick', value: 'SICK' },
  { label: 'Permit', value: 'PERMIT' },
  { label: 'Annual Leave', value: 'ANNUAL_LEAVE' },
  { label: 'Maternity Leave', value: 'MATERNITY_LEAVE' },
  { label: 'Paternity Leave', value: 'PATERNITY_LEAVE' },
  { label: 'Marriage Leave', value: 'MARRIAGE_LEAVE' },
  { label: 'Bereavement', value: 'BEREAVEMENT' },
  { label: 'Half Day', value: 'HALF_DAY' },
  { label: 'Work From Home', value: 'WORK_FROM_HOME' },
  { label: 'Other', value: 'OTHER' },
]

export const permissionStatusEnum = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
])
export type PermissionStatus = z.infer<typeof permissionStatusEnum>

const userMiniSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().optional(),
  employeeId: z.string().optional(),
  department: z
    .object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
    })
    .nullable()
    .optional(),
})

export const permissionSchema = z.object({
  id: z.string(),
  user: userMiniSchema.optional(),
  userId: z.string().optional(),
  type: permissionTypeEnum,
  reason: z.string().nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  // key storage, bukan url — jangan dipakai buat href
  attachmentUrl: z.string().nullable().optional(),
  // signed url dari server, ini yang dipakai
  attachmentUrl_url: z.string().nullable().optional(),
  status: permissionStatusEnum,
  // Note keputusan admin (alasan approve/reject) — kolom `approvedNote` di DB.
  approvedNote: z.string().nullable().optional(),
  // Relasi admin penyetuju (objek). Scalar id-nya `approvedBy` di DB, tak dipakai FE.
  approver: userMiniSchema.nullable().optional(),
  approvedAt: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
})
export type Permission = z.infer<typeof permissionSchema>

// Schema form untuk approve (note optional) & reject (note required).
export const approveFormSchema = z.object({
  note: z.string().max(500).optional(),
})
export type ApproveFormValues = z.infer<typeof approveFormSchema>

export const rejectFormSchema = z.object({
  note: z.string().min(1, 'Alasan penolakan wajib diisi').max(500),
})
export type RejectFormValues = z.infer<typeof rejectFormSchema>
