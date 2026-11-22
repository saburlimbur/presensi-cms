import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import {
  departmentsService,
  type DepartmentPayload,
} from '../api/departments.service'

export default function useUpdateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<DepartmentPayload>
    }) => departmentsService.update(id, payload),
    onSuccess: () => {
      toast.success('Department updated successfully')
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to update department')),
  })
}
