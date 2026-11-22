import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { locationsService } from '../api/location.api'

export default function useDeleteLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => locationsService.delete(id),
    onSuccess: () => {
      toast.success('Location deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to delete location')),
  })
}
