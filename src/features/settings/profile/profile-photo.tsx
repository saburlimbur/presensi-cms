import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { usersService } from '@/features/users/api/users.service'
import { useGetProfile } from '@/features/users/hooks/use-get-profile'

// Disamakan dengan backend (upload.middleware.js + user.controller.js):
// hanya jpeg/jpg/png, maksimal 5 MB.
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE = 5 * 1024 * 1024

export function ProfilePhoto() {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const { profile } = useGetProfile()

  const { mutate, isPending } = useMutation({
    mutationFn: (file: File) => usersService.updateProfilePhoto(file),
    onSuccess: () => {
      toast.success('Foto profil berhasil diperbarui')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Gagal memperbarui foto profil')),
  })

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // reset supaya memilih file yang sama lagi tetap memicu onChange
    event.target.value = ''
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan JPEG atau PNG.')
      return
    }
    if (file.size > MAX_SIZE) {
      toast.error('Ukuran file maksimal 5 MB.')
      return
    }
    mutate(file)
  }

  const initials = (profile?.fullName ?? '')
    .split(' ')
    .filter(Boolean)
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className='flex items-center gap-4'>
      <Avatar className='h-20 w-20'>
        <AvatarImage
          src={profile?.profilePhoto_url ?? ''}
          alt={profile?.fullName ?? 'Foto profil'}
          className='object-cover'
        />
        <AvatarFallback className='text-lg'>{initials}</AvatarFallback>
      </Avatar>
      <div className='space-y-1.5'>
        <input
          ref={inputRef}
          type='file'
          accept='image/jpeg,image/png'
          className='hidden'
          onChange={onFileChange}
        />
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='gap-2'
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} />
          {isPending ? 'Mengunggah...' : 'Ganti foto'}
        </Button>
        <p className='text-xs text-muted-foreground'>
          JPEG atau PNG, maksimal 5 MB.
        </p>
      </div>
    </div>
  )
}
