import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  employeeService,
  type UserUpdatePayload,
} from '../api/employee.service'

/**
 * Mutation hook untuk update employee (PATCH /users/:id).
 * Sama polanya dengan useCreateEmployee — toast + invalidate di sini.
 */
export default function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UserUpdatePayload
    }) => employeeService.update(id, payload),
    onSuccess: () => {
      toast.success('Employee updated successfully')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to update employee'
      toast.error(msg)
    },
  })
}
