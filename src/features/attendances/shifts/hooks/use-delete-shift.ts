import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { shiftsService } from '../api/shifts.service'

export default function useDeleteShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => shiftsService.delete(id),
    onSuccess: () => {
      toast.success('Shift deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to delete shift')),
  })
}
