import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { notificationsService } from '../api/notifications.service'

export default function useMarkAllRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: (res) => {
      toast.success(`${res.data.updated} notifikasi ditandai dibaca`)
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
        'Gagal menandai semua notifikasi'
      toast.error(msg)
    },
  })
}
