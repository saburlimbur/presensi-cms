import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { permissionsService } from '../api/permissions.service'

export default function useApprovePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      permissionsService.approve(id, note),
    onSuccess: () => {
      toast.success('Permission approved')
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? err?.message ?? 'Failed to approve'
      toast.error(msg)
    },
  })
}
