import ApiService from '@/lib/axios'
import type { AuditLogListResponse } from '../data/schema'

export interface ListAuditLogsParams {
  page?: number
  limit?: number
  userId?: string
  action?: string
  dateFrom?: string
  dateTo?: string
}

export const auditLogsService = {
  list: async (params?: ListAuditLogsParams) => {
    const res = await ApiService.get<AuditLogListResponse>('/audit-logs', {
      params,
    })
    return res.data
  },
}
