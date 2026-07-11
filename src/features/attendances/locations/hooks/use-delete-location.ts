import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { locationsService } from '../api/location.api'

export default function useDeleteLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => locationsService.delete(id),
    onSuccess: () => {
      toast.success('Location deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to delete location'
      toast.error(msg)
    },
  })
}
