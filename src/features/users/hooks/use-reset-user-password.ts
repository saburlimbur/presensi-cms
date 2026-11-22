import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { usersService } from '../api/users.service'

// Tidak meng-invalidate query apa pun: reset password tidak mengubah data
// user di tabel, hanya menghasilkan token reset yang kita tampilkan ke admin.
export default function useResetUserPassword() {
  return useMutation({
    mutationFn: (id: string) => usersService.resetPassword(id),
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Failed to generate reset link')),
  })
}
