import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { leaveBalancesService } from '../api/leave-balances.service'
import { type UpdateLeaveBalanceFormValues } from '../data/schema'

export default function useUpdateLeaveBalance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateLeaveBalanceFormValues
    }) => leaveBalancesService.update(id, payload),
    onSuccess: () => {
      toast.success('Leave balance updated successfully')
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to update leave balance')),
  })
}
