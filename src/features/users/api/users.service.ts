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
    const res = await api.get<UsersResponse>('/users', { params })
    return res.data
  },

  getById: async (id: string) => {
    const res = await api.get<User>(`/users/${id}`)
    return res.data
  },

  getProfile: async () => {
    const res = await api.get<User>('/users/profile')
    return res.data.data
  },

  create: async (payload: UserCreatePayload) => {
    const res = await api.post<User>('/users', payload)
    return res.data
  },

  update: async (id: string, payload: UserUpdatePayload) => {
    const res = await api.put<User>(`/users/${id}`, payload)
    return res.data
  },

  delete: async (id: string) => {
    const res = await api.delete(`/users/${id}`)
    return res.data
  },

  deleteMany: async (ids: string[]) => {
    const res = await api.delete('/users', { data: { ids } })
    return res.data
  },
}
