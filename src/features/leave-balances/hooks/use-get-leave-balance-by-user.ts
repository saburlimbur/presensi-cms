import { useQuery } from '@tanstack/react-query'
import { leaveBalancesService } from '../api/leave-balances.service'

export default function useGetLeaveBalanceByUser(userId?: string) {
  const query = useQuery({
    queryKey: ['leave-balances', 'by-user', userId],
    queryFn: () => leaveBalancesService.getByUser(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })

  return {
    leaveBalances: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}
