import { z } from 'zod'

// ngikutin adminCreateAttendanceSchema di backend
export const ATTENDANCE_STATUSES = [
  'PRESENT',
  'LATE',
  'ABSENT',
  'SICK',
  'PERMIT',
  'ON_LEAVE',
  'HOLIDAY',
  'WORK_FROM_HOME',
] as const

export const WORK_MODES = ['WFO', 'WFA'] as const

export const SHIFT_NAMES = [
  'MORNING',
  'AFTERNOON',
  'NIGHT',
  'FULL_DAY',
  'SPLIT_SHIFT',
  'FLEXIBLE',
] as const

// 'none' buat opsi tanpa shift (shiftName opsional)
export const NO_SHIFT = 'none'

// datetime disimpan string dari input, dikonversi ke iso pas submit
export const manualAttendanceFormSchema = z
  .object({
    date: z.string().min(1, 'Tanggal wajib diisi'),
    checkIn: z.string().min(1, 'Jam masuk wajib diisi'),
    checkOut: z.string().optional().or(z.literal('')),
    status: z.enum(ATTENDANCE_STATUSES),
    workMode: z.enum(WORK_MODES),
    shiftName: z.string().optional(),
    note: z.string().max(500, 'Catatan maksimal 500 karakter').optional().or(z.literal('')),
  })
  .refine(
    (v) => !v.checkOut || new Date(v.checkOut) >= new Date(v.checkIn),
    {
      message: 'Jam keluar tidak boleh sebelum jam masuk',
      path: ['checkOut'],
    }
  )
export type ManualAttendanceFormValues = z.infer<
  typeof manualAttendanceFormSchema
>
