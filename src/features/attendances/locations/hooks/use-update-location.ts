import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { locationsService } from '../api/location.api'
import { type LocationFormValues } from '../data/schema'

export default function useUpdateLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<LocationFormValues>
    }) => locationsService.update(id, payload),
    onSuccess: () => {
      toast.success('Location updated successfully')
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to update location'
      toast.error(msg)
    },
  })
}
