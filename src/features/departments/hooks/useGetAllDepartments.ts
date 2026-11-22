import { useQuery } from '@tanstack/react-query'
import { departmentsService } from '../api/departments.service'

export default function useGetAllDepartments(params?: Record<string, unknown>) {
  const { data, isLoading } = useQuery({
    queryKey: ['departments', params],

    queryFn: () => departmentsService.getAll(params),

    staleTime: 1000 * 60 * 30,

    placeholderData: (previousData) => previousData,
  })

  return { data, isLoading }
}
