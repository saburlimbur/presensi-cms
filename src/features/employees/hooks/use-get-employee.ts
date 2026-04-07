import { useQuery } from '@tanstack/react-query'
import { employeeService } from '../api/employee.service'

export default function useGetEmployee(params?: any) {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees', params],

    queryFn: () => employeeService.getAll(params),

    staleTime: 1000 * 60 * 30,

    placeholderData: (previousData) => previousData,
  })

  return { employees, isLoading }
}
