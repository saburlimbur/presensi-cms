import { useQuery } from '@tanstack/react-query'
import { permissionsService } from '../api/permissions.service'
import { type Permission } from '../data/schema'

export default function useGetPermissions(params?: Record<string, unknown>) {
  const query = useQuery({
    queryKey: ['permissions', params],
    queryFn: () => permissionsService.getAll(params),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  })

  // getAll mengembalikan envelope { data } atau langsung array — ambil array-nya.
  const raw = query.data as unknown
  const permissions: Permission[] = Array.isArray(raw)
    ? (raw as Permission[])
    : ((raw as { data?: Permission[] } | null | undefined)?.data ?? [])

  return {
    permissions,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  }
}
