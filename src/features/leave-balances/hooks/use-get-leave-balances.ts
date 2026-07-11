import { useQuery } from '@tanstack/react-query'
import { leaveBalancesService } from '../api/leave-balances.service'

export default function useGetLeaveBalances(params?: Record<string, unknown>) {
  const query = useQuery({
    queryKey: ['leave-balances', params],
    queryFn: () => leaveBalancesService.getAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })

  return {
    leaveBalances: query.data?.data ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}
