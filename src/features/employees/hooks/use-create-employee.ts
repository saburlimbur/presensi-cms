import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import {
  employeeService,
  type UserCreatePayload,
} from '../api/employee.service'

/**
 * Mutation hook untuk create employee.
 *
 * Tanggung jawab API-level (toast + invalidate cache) ditaruh di sini
 * supaya komponen form cuma kerja di UI layer (validation + reset form
 * + close dialog lewat `options.onSuccess` tambahan).
 *
 * Pemakaian:
 *   const createEmployee = useCreateEmployee()
 *   createEmployee.mutate(payload, {
 *     onSuccess: () => { form.reset(); closeDialog() },
 *   })
 */
export default function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserCreatePayload) => employeeService.create(payload),
    onSuccess: () => {
      toast.success('Employee created successfully')
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to create employee')),
  })
}
