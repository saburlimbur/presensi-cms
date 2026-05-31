import { z } from 'zod'

/**
 * Schema form Add/Edit Employee.
 *
 * Field yang dikirim ke backend (match `createUserSchema` di
 * absensi-server/src/modules/users/user.model.js):
 *   email, password, fullName, phone, departmentCode, position, role
 *
 * Field yang TIDAK perlu dari frontend (di-handle backend):
 *   employeeId   — auto-generate EMP-XXX via retry sequence
 *   isActive     — default true
 *   isFaceRegistered — default false, jadi true setelah enroll wajah
 */
export const employeeFormSchema = z
  .object({
    fullName: z.string().min(3, 'Full name minimal 3 karakter.'),
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
    }),
    phone: z.string().min(8, 'Phone number minimal 8 karakter.'),
    departmentCode: z.string().min(1, 'Department is required.'),
    position: z.string().min(1, 'Position is required.'),
    role: z.string().min(1, 'Role is required.'),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  // Password required saat create. Saat edit boleh kosong (berarti tidak ganti).
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    { message: 'Password is required.', path: ['password'] }
  )
  // Backend min 6 — disamakan di sini agar konsisten error-nya.
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 6
    },
    { message: 'Password minimal 6 karakter.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    { message: "Passwords don't match.", path: ['confirmPassword'] }
  )

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>
