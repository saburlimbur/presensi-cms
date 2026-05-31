import { useQuery } from '@tanstack/react-query'
import { shiftsService } from '../api/shifts.service'

// Skeleton hook — pemanggilan service & return shape akan disesuaikan
// saat integrasi API.
export default function useGetShifts(params?: Record<string, unknown>) {
  const query = useQuery({
    queryKey: ['shifts', params],
    queryFn: () => shiftsService.getAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })

  return {
    shifts: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}
