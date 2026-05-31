import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { reportApiService, type WeeklyQuery } from '../api/reports.service'

export function useWeeklyReports(params: WeeklyQuery) {
  return useQuery({
    queryKey: ['weekly-reports', params],
    queryFn: () => reportApiService.getWeekly(params),
    enabled: !!params.weekStart,
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })
}
