import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import {
  departmentsService,
  type DepartmentPayload,
} from '../api/departments.service'

export default function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DepartmentPayload) =>
      departmentsService.create(payload),
    onSuccess: () => {
      toast.success('Department created successfully')
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to create department')),
  })
}
