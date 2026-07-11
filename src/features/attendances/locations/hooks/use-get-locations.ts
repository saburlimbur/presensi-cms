import { useQuery } from '@tanstack/react-query'
import { locationsService } from '../api/location.api'

export default function useGetLocations(params?: Record<string, unknown>) {
  const query = useQuery({
    queryKey: ['locations', params],
    queryFn: () => locationsService.getAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })

  return {
    locations: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}
