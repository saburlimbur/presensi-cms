import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { notificationsService } from '../api/notifications.service'

export default function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (err: unknown) => {
      const msg =
        (
          err as {
            response?: { data?: { message?: string } }
            message?: string
          }
        )?.response?.data?.message ??
        (err as { message?: string })?.message ??
        'Gagal menandai notifikasi'
      toast.error(msg)
    },
  })
}
