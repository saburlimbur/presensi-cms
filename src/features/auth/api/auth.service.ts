import ApiService from '@/lib/axios'
import { User } from '@/features/users/data/schema'

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
  employeeId: string
  position: string
  role: string
  password: string
}

export interface UserUpdatePayload {
  fullName: string
  email: string
  phone: string
  employeeId: string
  position: string
  role: string
  password?: string
}

export const usersService = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await ApiService.get<UsersResponse>('/users', { params })
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
    const res = await ApiService.put<User>(`/users/${id}`, payload)
    return res.data
  },

  delete: async (id: string) => {
    const res = await ApiService.delete(`/users/${id}`)
    return res.data
  },

  deleteMany: async (ids: string[]) => {
    const res = await ApiService.delete('/users', { data: { ids } })
    return res.data
  },
}
