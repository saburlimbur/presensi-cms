import { z } from 'zod'

const departmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
})

const leaveBalanceUserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  employeeId: z.string(),
  department: departmentSchema.nullable(),
})

export const leaveBalanceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  year: z.number().int(),
  annualQuota: z.number().int(),
  usedDays: z.number().int(),
  remainingDays: z.number().int(),
  carryOverDays: z.number().int(),
  updatedAt: z.coerce.date().optional(),
  // Relasi user hanya ikut di response list & update, bukan di create/by-user.
  user: leaveBalanceUserSchema.nullable().optional(),
})
export type LeaveBalance = z.infer<typeof leaveBalanceSchema>

export const createLeaveBalanceFormSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  year: z.number().int().min(2000).max(2100),
  annualQuota: z.number().int().min(0),
  carryOverDays: z.number().int().min(0),
})
export type CreateLeaveBalanceFormValues = z.infer<
  typeof createLeaveBalanceFormSchema
>

export const updateLeaveBalanceFormSchema = z.object({
  annualQuota: z.number().int().min(0),
  carryOverDays: z.number().int().min(0),
})
export type UpdateLeaveBalanceFormValues = z.infer<
  typeof updateLeaveBalanceFormSchema
>
