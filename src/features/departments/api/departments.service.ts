import ApiService from '@/lib/axios'
import { type Department } from '../components/departments-columns'

// headId null buat ngosongin kepala, uuid buat nunjuk orang
export type DepartmentPayload = {
  name: string
  code: string
  headId?: string | null
}

export const departmentsService = {
  getAll: async (params?: Record<string, unknown>): Promise<Department[]> => {
    const response = await ApiService.get('/departments', {
      params: { limit: 100, ...params },
    })
    return (response.data?.data ?? []) as Department[]
  },

  getById: async (id: string): Promise<Department | null> => {
    const res = await ApiService.get(`/departments/${id}`)
    return (res.data?.data ?? null) as Department | null
  },

  getByCode: async (code: string): Promise<Department | null> => {
    const res = await ApiService.get(`/departments/code/${code}`)
    return (res.data?.data ?? null) as Department | null
  },

  create: async (payload: DepartmentPayload): Promise<Department> => {
    const res = await ApiService.post('/departments', payload)
    return res.data.data as Department
  },

  update: async (
    id: string,
    payload: Partial<DepartmentPayload>
  ): Promise<Department> => {
    const res = await ApiService.put(`/departments/${id}`, payload)
    return res.data.data as Department
  },

  delete: async (id: string): Promise<void> => {
    await ApiService.delete(`/departments/${id}`)
  },
}
