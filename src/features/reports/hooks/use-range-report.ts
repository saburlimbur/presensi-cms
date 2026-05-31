import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { type RangeQuery, reportApiService } from '../api/reports.service'

export function useRangeReports(params: RangeQuery) {
  return useQuery({
    queryKey: ['range-reports', params],
    queryFn: () => reportApiService.getRange(params),
    enabled: !!params.from && !!params.to,
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })
}
