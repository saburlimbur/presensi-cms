import ApiService from '@/lib/axios'
import { type Shift, type ShiftFormValues } from '../data/schema'

// Skeleton — sesuaikan response shape saat integrasi.
// Endpoints (admin only): lihat backend src/modules/shifts/shifts.routes.js
//   GET    /shifts
//   GET    /shifts/:id
//   POST   /shifts
//   PUT    /shifts/:id
//   DELETE /shifts/:id
export const shiftsService = {
  getAll: async (_params?: Record<string, unknown>) => {
    // TODO(integrasi): const res = await ApiService.get('/shifts', { params: _params })
    return [] as Shift[]
  },

  getById: async (_id: string) => {
    // TODO(integrasi): const res = await ApiService.get(`/shifts/${_id}`)
    return null as Shift | null
  },

  create: async (_payload: ShiftFormValues) => {
    // TODO(integrasi): const res = await ApiService.post('/shifts', _payload)
    return null as Shift | null
  },

  update: async (_id: string, _payload: Partial<ShiftFormValues>) => {
    // TODO(integrasi): const res = await ApiService.put(`/shifts/${_id}`, _payload)
    return null as Shift | null
  },

  delete: async (_id: string) => {
    // TODO(integrasi): const res = await ApiService.delete(`/shifts/${_id}`)
    return null
  },
}

// Jaga import agar tidak hilang saat unused di skeleton.
export { ApiService }
