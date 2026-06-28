import ApiService from '@/lib/axios'
import { User } from '@/features/users/data/schema'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface UserCreatePayload {
  fullName: string
  email: string
  phone: string
  departmentCode: string // backend resolve ke departmentId
  position: string
  password: string
  role?: 'ADMIN' | 'EMPLOYEE' // default 'EMPLOYEE' di backend
  joinDate?: string // ISO date, opsional
}

// Field employeeId di-generate backend — tidak boleh diubah dari frontend.
export interface UserUpdatePayload {
  fullName?: string
  email?: string
  phone?: string
  departmentCode?: string
  position?: string
  role?: 'ADMIN' | 'EMPLOYEE'
  isActive?: boolean
  password?: string
}

export const employeeService = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await ApiService.get<ApiResponse<User[]>>('/users', {
      params: {
        ...params,
        role: 'EMPLOYEE',
      },
    })
    return res.data
  },

  getById: async (id: string) => {
    const res = await ApiService.get<User>(`/users/${id}`)
    return res.data
  },

  create: async (payload: UserCreatePayload) => {
    const res = await ApiService.post<User>('/users', payload)
    return res.data
  },

  update: async (id: string, payload: UserUpdatePayload) => {
    const res = await ApiService.patch<User>(`/users/${id}`, payload)
    return res.data
  },

  // Backend sengaja tidak meng-hard-delete user demi menjaga histori
  // absensi/FK. "Hapus" = nonaktifkan akun (PATCH isActive:false).
  delete: async (id: string) => {
    const res = await ApiService.patch(`/users/${id}`, { isActive: false })
    return res.data
  },

  deleteMany: async (ids: string[]) => {
    const res = await Promise.all(
      ids.map((id) => ApiService.patch(`/users/${id}`, { isActive: false }))
    )
    return res.map((r) => r.data)
  },
}
