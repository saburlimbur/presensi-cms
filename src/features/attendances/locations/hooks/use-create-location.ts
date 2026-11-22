import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { locationsService } from '../api/location.api'
import { type LocationFormValues } from '../data/schema'

export default function useCreateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LocationFormValues) =>
      locationsService.create(payload),
    onSuccess: () => {
      toast.success('Location created successfully')
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to create location')),
  })
}
