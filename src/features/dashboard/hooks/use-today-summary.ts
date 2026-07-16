import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../api/dashboard.api'

export function useTodaySummary(date?: string) {
  const query = useQuery({
    queryKey: ['today-summary', date ?? 'today'],
    queryFn: () => dashboardService.getTodaySummary(date),
    staleTime: 60_000,
    refetchInterval: 60_000,
    placeholderData: (prev) => prev,
  })

  return {
    summary: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  }
}
