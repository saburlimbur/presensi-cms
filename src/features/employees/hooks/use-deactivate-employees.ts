import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { employeeService } from '../api/employee.service'

export function useDeactivateEmployees() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (ids: string[]) => employeeService.deactivateMany(ids),
    onSuccess: (_data, ids) => {
      toast.success(
        `Deactivated ${ids.length} ${ids.length > 1 ? 'employees' : 'employee'} successfully.`
      )
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['department-employees'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to deactivate employee')),
  })

  return { deactivateEmployees: mutate, isPending }
}
