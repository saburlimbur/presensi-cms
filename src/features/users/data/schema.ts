import { z } from 'zod'

export const positionEnum = z.enum([
  'DIRECTOR',
  'MANAGER',
  'SUPERVISOR',
  'TEAM_LEAD',
  'SENIOR_STAFF',
  'STAFF',
  'JUNIOR_STAFF',
  'HR_SPECIALIST',
  'FINANCE_SPECIALIST',
  'IT_SPECIALIST',
  'MARKETING_SPECIALIST',
  'INTERN',
  'CONTRACT',
  'OTHER',
])
export type Position = z.infer<typeof positionEnum>

export const roleEnum = z.enum(['ADMIN', 'EMPLOYEE'])
export type Role = z.infer<typeof roleEnum>

const _userSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  phone: z.string(),
  employeeId: z.string(),
  departmentId: z.string().nullable(),
  departmentName: z.string().nullable(),
  position: positionEnum,
  role: roleEnum,
  joinDate: z.coerce.date().nullable(),
  isActive: z.boolean(),
  isFaceRegistered: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof _userSchema>
