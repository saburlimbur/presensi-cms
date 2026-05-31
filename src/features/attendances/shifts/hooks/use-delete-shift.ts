import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { shiftsService } from '../api/shifts.service'

export default function useDeleteShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => shiftsService.delete(id),
    onSuccess: () => {
      toast.success('Shift deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? err?.message ?? 'Failed to delete shift'
      toast.error(msg)
    },
  })
}
