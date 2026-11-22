import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { departmentsService } from '../api/departments.service'

export default function useDeleteDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => departmentsService.delete(id),
    onSuccess: () => {
      toast.success('Department deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to delete department')),
  })
}
