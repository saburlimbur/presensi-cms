import ApiService from '@/lib/axios'
import { type Location, type LocationFormValues } from '../data/schema'

export const locationsService = {
  getAll: async (params?: Record<string, unknown>): Promise<Location[]> => {
    const res = await ApiService.get('/locations', { params })
    return (res.data?.data ?? []) as Location[]
  },

  getById: async (id: string): Promise<Location | null> => {
    const res = await ApiService.get(`/locations/${id}`)
    return (res.data?.data ?? null) as Location | null
  },

  create: async (payload: LocationFormValues): Promise<Location> => {
    const res = await ApiService.post('/locations', payload)
    return res.data.data as Location
  },

  update: async (
    id: string,
    payload: Partial<LocationFormValues>
  ): Promise<Location> => {
    const res = await ApiService.put(`/locations/${id}`, payload)
    return res.data.data as Location
  },

  delete: async (id: string): Promise<void> => {
    await ApiService.delete(`/locations/${id}`)
  },
}
