import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { getErrorMessage } from '@/lib/handle-server-error'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'
import { usersService } from '@/features/users/api/users.service'

// Disamakan dengan updatePasswordSchema di backend (user.model.js):
// oldPassword wajib, newPassword 6-100 karakter. confirmPassword hanya
// dicek di client dan tidak dikirim.
const accountFormSchema = z
  .object({
    oldPassword: z.string().min(1, 'Password lama wajib diisi.'),
    newPassword: z
      .string()
      .min(6, 'Password baru minimal 6 karakter.')
      .max(100, 'Password baru maksimal 100 karakter.'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak sama.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: 'Password baru harus berbeda dari password lama.',
    path: ['newPassword'],
  })

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { auth } = useAuthStore()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: ({ oldPassword, newPassword }: AccountFormValues) =>
      usersService.updatePassword({ oldPassword, newPassword }),
    onSuccess: () => {
      // Backend mencabut semua refresh token setelah ganti password, jadi
      // sesi ini tidak bisa diperpanjang lagi — minta login ulang sekarang.
      toast.success('Password berhasil diperbarui. Silakan login kembali.')
      auth.reset()
      queryClient.clear()
      navigate({ to: '/sign-in', replace: true })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Gagal memperbarui password')),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='oldPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Lama</FormLabel>
              <FormControl>
                <PasswordInput autoComplete='current-password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <FormControl>
                <PasswordInput autoComplete='new-password' {...field} />
              </FormControl>
              <FormDescription>Minimal 6 karakter.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password Baru</FormLabel>
              <FormControl>
                <PasswordInput autoComplete='new-password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Update password'}
        </Button>
      </form>
    </Form>
  )
}
