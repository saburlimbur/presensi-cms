import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from '../api/users.service'

// Tidak meng-invalidate query apa pun: reset password tidak mengubah data
// user di tabel, hanya menghasilkan token reset yang kita tampilkan ke admin.
export default function useResetUserPassword() {
  return useMutation({
    mutationFn: (id: string) => usersService.resetPassword(id),
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to generate reset link'
      toast.error(msg)
    },
  })
}
