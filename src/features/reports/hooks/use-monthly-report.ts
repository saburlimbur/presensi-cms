import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { type MonthlyQuery, reportApiService } from '../api/reports.service'

export function useMonthlyReports(params: MonthlyQuery) {
  return useQuery({
    queryKey: ['monthly-reports', params],
    queryFn: () => reportApiService.getMonthly(params),
    enabled: !!params.month && !!params.year,
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })
}
