import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { shiftsService } from '../api/shifts.service'
import { type ShiftFormValues } from '../data/schema'

export default function useUpdateShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<ShiftFormValues>
    }) => shiftsService.update(id, payload),
    onSuccess: () => {
      toast.success('Shift updated successfully')
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? err?.message ?? 'Failed to update shift'
      toast.error(msg)
    },
  })
}
