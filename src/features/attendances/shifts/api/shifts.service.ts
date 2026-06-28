import ApiService from '@/lib/axios'
import { type Shift, type ShiftFormValues } from '../data/schema'

export const shiftsService = {
  getAll: async (params?: Record<string, unknown>): Promise<Shift[]> => {
    const res = await ApiService.get('/shifts', { params })
    return (res.data?.data ?? []) as Shift[]
  },

  getById: async (id: string): Promise<Shift | null> => {
    const res = await ApiService.get(`/shifts/${id}`)
    return (res.data?.data ?? null) as Shift | null
  },

  create: async (payload: ShiftFormValues): Promise<Shift> => {
    const res = await ApiService.post('/shifts', payload)
    return res.data.data as Shift
  },

  update: async (
    id: string,
    payload: Partial<ShiftFormValues>
  ): Promise<Shift> => {
    const res = await ApiService.put(`/shifts/${id}`, payload)
    return res.data.data as Shift
  },

  delete: async (id: string): Promise<void> => {
    await ApiService.delete(`/shifts/${id}`)
  },
}
