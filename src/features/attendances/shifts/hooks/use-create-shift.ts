import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
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
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to create shift')),
  })
}
