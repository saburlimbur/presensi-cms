import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { shiftsService } from '../api/shifts.service'
import { type ShiftFormValues } from '../data/schema'

export default function useCreateShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ShiftFormValues) => shiftsService.create(payload),
    onSuccess: () => {
      toast.success('Shift created successfully')
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? err?.message ?? 'Failed to create shift'
      toast.error(msg)
    },
  })
}
