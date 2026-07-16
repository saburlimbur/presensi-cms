import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { departmentsService, type DepartmentPayload } from '../api/departments.service'

export default function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DepartmentPayload) =>
      departmentsService.create(payload),
    onSuccess: () => {
      toast.success('Department created successfully')
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to create department'
      toast.error(msg)
    },
  })
}
