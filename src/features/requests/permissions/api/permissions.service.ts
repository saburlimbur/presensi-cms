import ApiService from '@/lib/axios'
import { type Permission } from '../data/schema'

// Backend admin endpoints (lihat permission.routes.js):
//   GET    /permissions                 — list all
//   GET    /permissions/:id             — detail
//   PATCH  /permissions/:id/approve     — body: { note? }       (opsional, max 500)
//   PATCH  /permissions/:id/reject      — body: { note }        (wajib, max 500)
// Semua handler membungkus payload dalam envelope { success, message, data }.
type PermissionEnvelope = { data: Permission | null }

export const permissionsService = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await ApiService.get('/permissions', {
      params: { limit: 100, ...params },
    })
    return res.data as Permission
  },

  getById: async (id: string) => {
    const res = await ApiService.get(`/permissions/${id}`)
    return res.data as PermissionEnvelope
  },

  approve: async (id: string, note?: string) => {
    const res = await ApiService.patch(`/permissions/${id}/approve`, { note })
    return res.data?.data as Permission | null
  },

  reject: async (id: string, note: string) => {
    const res = await ApiService.patch(`/permissions/${id}/reject`, { note })
    return res.data?.data as Permission | null
  },
}

export { ApiService }
