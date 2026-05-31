import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  auditLogsService,
  type ListAuditLogsParams,
} from '../api/audit-logs.service'

export default function useGetAuditLogs(params?: ListAuditLogsParams) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => auditLogsService.list(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
