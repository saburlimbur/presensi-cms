import { z } from 'zod'

// radix ga nerima value kosong di select, jadi 'none' dipakai buat opsi tanpa kepala
export const NO_HEAD = 'none'

export const departmentFormSchema = z.object({
  name: z.string().min(3, 'Nama departemen minimal 3 karakter').max(100),
  code: z
    .string()
    .min(2, 'Kode departemen minimal 2 karakter')
    .max(20)
    .transform((v) => v.toUpperCase()),
  // isinya 'none' atau uuid, dikonversi pas submit
  headId: z.string().optional(),
})
export type DepartmentFormValues = z.infer<typeof departmentFormSchema>
