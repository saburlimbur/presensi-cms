import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { permissionsService } from '../api/permissions.service'

export default function useRejectPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      permissionsService.reject(id, note),
    onSuccess: () => {
      toast.success('Permission rejected')
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to reject')),
  })
}
