import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { departmentsService } from '../api/departments.service'

export default function useDeleteDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => departmentsService.delete(id),
    onSuccess: () => {
      toast.success('Department deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to delete department'
      toast.error(msg)
    },
  })
}
