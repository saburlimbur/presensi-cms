import api from '@/lib/axios'
import { type User } from '../data/schema'

export interface UsersResponse {
  data: User[]
  meta: {
    total: number
    page: number
    pageSize: number
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
  role?: 'ADMIN' | 'EMPLOYEE' // default 'EMPLOYEE'
  joinDate?: string
}

export interface UserUpdatePayload {
  fullName?: string
  email?: string
  phone?: string
  departmentCode?: string // backend resolve ke departmentId
  position?: string
  role?: 'ADMIN' | 'EMPLOYEE'
  isActive?: boolean
  password?: string
}

export const usersService = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await api.get<UsersResponse>('/users', { params })
    return res.data
  },

  getById: async (id: string) => {
    const res = await api.get<User>(`/users/${id}`)
    return res.data
  },

  getProfile: async () => {
    const res = await api.get<{ data: User }>('/users/profile')
    return res.data.data
  },

  create: async (payload: UserCreatePayload) => {
    const res = await api.post<User>('/users', payload)
    return res.data
  },

  update: async (id: string, payload: UserUpdatePayload) => {
    const res = await api.patch<User>(`/users/${id}`, payload)
    return res.data
  },

  // Backend sengaja tidak meng-hard-delete user demi menjaga histori
  // absensi/FK. "Hapus" di UI = nonaktifkan akun (PATCH isActive:false).
  delete: async (id: string) => {
    const res = await api.patch(`/users/${id}`, { isActive: false })
    return res.data
  },

  deleteMany: async (ids: string[]) => {
    const res = await Promise.all(
      ids.map((id) => api.patch(`/users/${id}`, { isActive: false }))
    )
    return res.map((r) => r.data)
  },
}
