import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import useGetNotifications from '../hooks/use-get-notifications'
import useMarkAllRead from '../hooks/use-mark-all-read'
import useMarkAsRead from '../hooks/use-mark-as-read'
import {
  type Notification,
  type NotificationDataAttendance,
  type NotificationDataPermission,
} from '../data/schema'

const PAGE_SIZE = 15

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

const typeColor: Record<string, string> = {
  PERMISSION_SUBMITTED: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  PERMISSION_APPROVED: 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200',
  PERMISSION_REJECTED: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200',
  ATTENDANCE_CHECK_IN: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200',
  ATTENDANCE_CHECK_OUT: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200',
  ATTENDANCE_REMINDER: 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-200',
  ANNOUNCEMENT: 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200',
  SYSTEM: 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-200',
}

export function NotificationsList() {
  const [page, setPage] = useState(1)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const { data, isLoading, isFetching } = useGetNotifications({
    page,
    limit: PAGE_SIZE,
    unreadOnly,
  })
  const markRead = useMarkAsRead()
  const markAllRead = useMarkAllRead()
  const navigate = useNavigate()

  const items = data?.data ?? []
  const totalPages = data?.pagination?.totalPages ?? 1

  const onItemClick = (n: Notification) => {
    if (!n.readAt) markRead.mutate(n.id)
    const path = routeFromNotif(n)
    if (path) navigate({ to: path })
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <Button
            variant={unreadOnly ? 'default' : 'outline'}
            size='sm'
            onClick={() => {
              setUnreadOnly((v) => !v)
              setPage(1)
            }}
          >
            {unreadOnly ? 'Tampilkan semua' : 'Belum dibaca saja'}
          </Button>
        </div>
        <Button
          variant='ghost'
          size='sm'
          disabled={markAllRead.isPending}
          onClick={() => markAllRead.mutate()}
        >
          <CheckCheck className='mr-2 h-4 w-4' />
          Tandai semua dibaca
        </Button>
      </div>

      {/* List */}
      <Card className='divide-y p-0'>
        {isLoading ? (
          <div className='flex items-center justify-center p-8 text-muted-foreground'>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Memuat notifikasi…
          </div>
        ) : items.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-12 text-muted-foreground'>
            <Bell className='mb-2 h-8 w-8' />
            <p className='text-sm'>
              {unreadOnly
                ? 'Tidak ada notifikasi yang belum dibaca.'
                : 'Belum ada notifikasi.'}
            </p>
          </div>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              type='button'
              onClick={() => onItemClick(n)}
              className={cn(
                'flex w-full items-start gap-3 p-4 text-start transition-colors hover:bg-muted/50',
                !n.readAt && 'bg-muted/30'
              )}
            >
              <div
                className={cn(
                  'mt-1 h-2 w-2 shrink-0 rounded-full',
                  n.readAt ? 'bg-transparent' : 'bg-primary'
                )}
                aria-hidden
              />
              <div className='flex-1 space-y-1'>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='text-sm font-medium'>{n.title}</span>
                  <Badge
                    variant='secondary'
                    className={cn(
                      'font-mono text-[10px]',
                      typeColor[n.type] ?? ''
                    )}
                  >
                    {n.type}
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>{n.body}</p>
                <p className='text-xs text-muted-foreground'>
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                    locale: id,
                  })}
                </p>
              </div>
            </button>
          ))
        )}
      </Card>

      {/* Pagination */}
      {items.length > 0 && totalPages > 1 && (
        <div className='flex items-center justify-end gap-2'>
          <span className='text-xs text-muted-foreground'>
            Halaman {page} dari {totalPages}
            {isFetching && ' · memuat…'}
          </span>
          <Button
            variant='outline'
            size='icon'
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            disabled={page >= totalPages || isFetching}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  )
}
