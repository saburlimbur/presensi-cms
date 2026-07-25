import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
import { Input } from '@/components/ui/input'
import { usersService } from '@/features/users/api/users.service'
import { useGetProfile } from '@/features/users/hooks/use-get-profile'

// Disamakan dengan updateProfileSchema di backend (user.model.js):
// backend hanya menerima fullName & phone.
const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Nama minimal 3 karakter.')
    .max(100, 'Nama maksimal 100 karakter.'),
  phone: z
    .string()
    .min(8, 'Nomor telepon minimal 8 digit.')
    .max(20, 'Nomor telepon maksimal 20 digit.'),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const qc = useQueryClient()
  const { profile } = useGetProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    // `values` menyinkronkan form saat data profil selesai di-fetch.
    values: {
      fullName: profile?.fullName ?? '',
      phone: profile?.phone ?? '',
    },
    mode: 'onChange',
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ProfileFormValues) => usersService.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    try {
      await mutateAsync(data)
      toast.success('Profil berhasil diperbarui')
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Gagal memperbarui profil'
      toast.error(message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder='Nama lengkap' {...field} />
              </FormControl>
              <FormDescription>
                Nama yang tampil di sistem absensi.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input
                  placeholder='08xxxxxxxxxx'
                  inputMode='numeric'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Update profile'}
        </Button>
      </form>
    </Form>
  )
}
