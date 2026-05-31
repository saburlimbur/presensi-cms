import { useNavigate } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import {
  type Notification,
  type NotificationDataAttendance,
  type NotificationDataPermission,
} from '@/features/notifications/data/schema'
import useGetNotifications from '@/features/notifications/hooks/use-get-notifications'
import useMarkAllRead from '@/features/notifications/hooks/use-mark-all-read'
import useMarkAsRead from '@/features/notifications/hooks/use-mark-as-read'
import useUnreadCount from '@/features/notifications/hooks/use-unread-count'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const DROPDOWN_LIMIT = 8

const routeFromNotif = (n: Notification): string | null => {
  if (n.type.startsWith('PERMISSION_')) {
    const pid = (n.data as NotificationDataPermission | null)?.permissionId
    return pid ? '/requests/permissions' : null
  }
  if (n.type.startsWith('ATTENDANCE_')) {
    const aid = (n.data as NotificationDataAttendance | null)?.attendanceId
    return aid ? '/attendances/reports' : null
  }
  return null
}

export function NotificationDropdown() {
  const { data: unreadCount = 0 } = useUnreadCount()
  const { data, isLoading } = useGetNotifications({
    page: 1,
    limit: DROPDOWN_LIMIT,
  })
  const markRead = useMarkAsRead()
  const markAllRead = useMarkAllRead()
  const navigate = useNavigate()

  const items = data?.data ?? []

  const handleClickItem = (n: Notification) => {
    if (!n.readAt) markRead.mutate(n.id)
    const path = routeFromNotif(n)
    if (path) navigate({ to: path })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          aria-label='Notifications'
          className='relative rounded-full border border-border bg-background p-2.5 transition active:scale-95'
        >
          <Bell size={14} />
          {unreadCount > 0 && (
            <span className='absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] leading-4 font-medium text-white'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80 p-0' align='end'>
        <div className='flex items-center justify-between px-3 py-2'>
          <DropdownMenuLabel className='p-0 text-sm'>
            Notifikasi
          </DropdownMenuLabel>
          {items.some((n) => !n.readAt) && (
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                markAllRead.mutate()
              }}
              className='flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-foreground'
            >
              <CheckCheck className='h-3 w-3' />
              Tandai semua dibaca
            </button>
          )}
        </div>
        <DropdownMenuSeparator className='m-0' />

        <div className='max-h-96 overflow-y-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Memuat…
            </div>
          ) : items.length === 0 ? (
            <div className='flex flex-col items-center justify-center p-6 text-sm text-muted-foreground'>
              <Bell className='mb-1 h-5 w-5' />
              Belum ada notifikasi.
            </div>
          ) : (
            items.map((n) => (
              <DropdownMenuItem
                key={n.id}
                onClick={() => handleClickItem(n)}
                className={cn(
                  'flex cursor-pointer flex-col items-start gap-1 px-3 py-2',
                  !n.readAt && 'bg-muted/40'
                )}
              >
                <div className='flex w-full items-start gap-2'>
                  <span
                    className={cn(
                      'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                      n.readAt ? 'bg-transparent' : 'bg-primary'
                    )}
                    aria-hidden
                  />
                  <div className='flex-1'>
                    <p className='text-sm font-medium leading-tight'>
                      {n.title}
                    </p>
                    <p className='mt-0.5 text-xs whitespace-normal text-muted-foreground'>
                      {n.body}
                    </p>
                    <p className='mt-1 text-[10px] text-muted-foreground'>
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator className='m-0' />
        <DropdownMenuItem
          onClick={() => navigate({ to: '/notifications' })}
          className='justify-center py-2 text-xs'
        >
          Lihat semua notifikasi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
