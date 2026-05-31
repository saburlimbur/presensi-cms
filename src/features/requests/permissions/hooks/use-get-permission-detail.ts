import { useQuery } from '@tanstack/react-query'
import { permissionsService } from '../api/permissions.service'

export default function useGetPermissionDetail(id?: string) {
  const query = useQuery({
    queryKey: ['permissions', 'detail', id],
    queryFn: () => permissionsService.getById(id as string),
    enabled: !!id,
    staleTime: 1000 * 60,
  })

  return {
    detail: query.data?.data,
    isLoading: query.isLoading,
  }
}
