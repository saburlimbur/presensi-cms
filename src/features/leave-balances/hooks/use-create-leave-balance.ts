import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { leaveBalancesService } from '../api/leave-balances.service'
import { type CreateLeaveBalanceFormValues } from '../data/schema'

export default function useCreateLeaveBalance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateLeaveBalanceFormValues) =>
      leaveBalancesService.create(payload),
    onSuccess: () => {
      toast.success('Leave balance created successfully')
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to create leave balance')),
  })
}
