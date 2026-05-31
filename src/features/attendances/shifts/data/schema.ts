import { z } from 'zod'

// Mirror VALID_SHIFT_NAMES di backend shifts.model.js.
export const shiftNameEnum = z.enum([
  'MORNING',
  'AFTERNOON',
  'NIGHT',
  'FULL_DAY',
  'SPLIT_SHIFT',
  'FLEXIBLE',
])
export type ShiftName = z.infer<typeof shiftNameEnum>

export const SHIFT_NAME_OPTIONS: { label: string; value: ShiftName }[] = [
  { label: 'Morning', value: 'MORNING' },
  { label: 'Afternoon', value: 'AFTERNOON' },
  { label: 'Night', value: 'NIGHT' },
  { label: 'Full Day', value: 'FULL_DAY' },
  { label: 'Split Shift', value: 'SPLIT_SHIFT' },
  { label: 'Flexible', value: 'FLEXIBLE' },
]

export const shiftSchema = z.object({
  id: z.string(),
  name: shiftNameEnum,
  // Backend pakai ISO datetime untuk startTime/endTime.
  startTime: z.string(),
  endTime: z.string(),
  gracePeriod: z.number().int().nonnegative(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})
export type Shift = z.infer<typeof shiftSchema>

export const shiftFormSchema = z.object({
  name: shiftNameEnum,
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  gracePeriod: z.coerce.number().int().min(0).max(180),
  description: z.string().max(255).optional().or(z.literal('')),
  isActive: z.boolean().default(false),
})
export type ShiftFormValues = z.infer<typeof shiftFormSchema>
