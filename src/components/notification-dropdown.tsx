import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

type Notification = {
  id: string
  title: string
  message: string
  time: string
}

const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'Clock In Reminder',
    message: 'Jangan lupa clock in hari ini sebelum pukul 08.00.',
    time: '5 menit lalu',
  },
  {
    id: '2',
    title: 'Jadwal Baru',
    message: 'Jadwal kerja minggu depan telah diperbarui.',
    time: '1 jam lalu',
  },
  {
    id: '3',
    title: 'Pengajuan Disetujui',
    message: 'Pengajuan izin kamu telah disetujui oleh HRD.',
    time: 'Kemarin',
  },
]

export function NotificationDropdown() {
  const unreadCount = dummyNotifications.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          aria-label='Notifications'
          className='relative rounded-full border border-gray-200 bg-white p-2.5 transition active:scale-95'
        >
          <Bell size={14} />
          {unreadCount > 0 && (
            <span className='absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] leading-4 font-medium text-white'>
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-72' align='end'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dummyNotifications.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className='flex flex-col items-start gap-1 py-2'
            >
              <span className='text-sm font-medium'>{notif.title}</span>
              <span className='text-xs whitespace-normal text-muted-foreground'>
                {notif.message}
              </span>
              <span className='text-[10px] text-gray-400'>{notif.time}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
