import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to create location'
      toast.error(msg)
    },
  })
}
