import { differenceInMinutes, formatDistanceToNow, isToday } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { ArrowRight, CalendarClock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAllUserAttendance } from '@/features/attendances/hooks/use-all-user-attendance'

const formatDuration = (minutes: number) => {
  if (minutes < 1) return '<1m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}j`
  return `${h}j ${m}m`
}

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

const SessionRow = ({ session }: { session: any }) => {
  const lastActivity = new Date(session.checkOut ?? session.checkIn)
  const durationMinutes = differenceInMinutes(
    session.checkOut ? new Date(session.checkOut) : new Date(),
    new Date(session.checkIn)
  )
  const initials =
    session.user?.fullName?.substring(0, 2).toUpperCase() || '??'

  return (
    <li className='group flex items-center gap-3 rounded-md px-2 py-3 transition-colors hover:bg-muted/40'>
      <Avatar className='h-10 w-10 shrink-0'>
        <AvatarImage src='' alt={session.user?.fullName} />
        <AvatarFallback className='bg-muted text-xs font-semibold text-muted-foreground'>
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold text-foreground'>
          {session.user?.fullName}
        </p>
        <p className='mt-0.5 truncate text-xs text-muted-foreground'>
          {session.user?.department?.name || 'Tanpa departemen'}
          <span className='mx-1.5 text-muted-foreground/40'>·</span>
          <span className='font-medium tracking-wide uppercase'>
            {session.method}
          </span>
        </p>
      </div>

      <div className='shrink-0 text-right'>
        <div className='font-mono text-base font-semibold tabular-nums leading-none text-foreground'>
          <span>{session.checkIn ? formatTime(session.checkIn) : '—'}</span>
          <span className='mx-1.5 text-muted-foreground/40'>→</span>
          <span
            className={cn(
              session.checkOut
                ? 'text-foreground'
                : 'text-muted-foreground/50'
            )}
          >
            {session.checkOut ? formatTime(session.checkOut) : '—'}
          </span>
        </div>
        <div className='mt-1.5 flex items-center justify-end gap-1.5 text-[11px]'>
          <span className='font-medium tabular-nums text-foreground'>
            {formatDuration(durationMinutes)}
          </span>
          <span className='text-muted-foreground/40'>·</span>
          <span className='text-muted-foreground'>
            {formatDistanceToNow(lastActivity, { addSuffix: true })}
          </span>
        </div>
      </div>
    </li>
  )
}

const SectionHeader = ({
  label,
  count,
  variant,
}: {
  label: string
  count: number
  variant: 'active' | 'completed'
}) => (
  <div className='flex items-center justify-between px-2 pt-1 pb-2'>
    <div className='flex items-center gap-2'>
      {variant === 'active' ? (
        <span className='relative flex h-1.5 w-1.5'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75' />
          <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500' />
        </span>
      ) : (
        <span className='inline-flex h-1.5 w-1.5 rounded-full bg-muted-foreground/40' />
      )}
      <span className='text-xs font-semibold tracking-wide text-foreground uppercase'>
        {label}
      </span>
    </div>
    <span className='font-mono text-xs font-medium tabular-nums text-muted-foreground'>
      {count}
    </span>
  </div>
)

export function RecentAttendance() {
  const { allUserAttendance, isLoading: isLoadingAttendance } =
    useAllUserAttendance()

  const sessions = (allUserAttendance?.data ?? [])
    .filter((att: any) => {
      const inToday = att.checkIn && isToday(new Date(att.checkIn))
      const outToday = att.checkOut && isToday(new Date(att.checkOut))
      return inToday || outToday
    })
    .sort((a: any, b: any) => {
      const aTime = new Date(a.checkOut ?? a.checkIn).getTime()
      const bTime = new Date(b.checkOut ?? b.checkIn).getTime()
      return bTime - aTime
    })

  const activeSessions = sessions.filter((s: any) => !s.checkOut)
  const completedSessions = sessions.filter((s: any) => s.checkOut)

  if (isLoadingAttendance) {
    return (
      <div className='space-y-5'>
        {[...Array(2)].map((_, s) => (
          <div key={s} className='space-y-2'>
            <div className='flex items-center justify-between px-2'>
              <Skeleton className='h-3 w-32' />
              <Skeleton className='h-3 w-6' />
            </div>
            <div className='space-y-1'>
              {[...Array(2)].map((_, i) => (
                <div key={i} className='flex items-center gap-3 px-2 py-3'>
                  <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-4 w-40' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                  <div className='space-y-2 text-right'>
                    <Skeleton className='ml-auto h-5 w-32' />
                    <Skeleton className='ml-auto h-3 w-20' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center gap-3 py-12 text-center'>
        <div className='flex h-11 w-11 items-center justify-center rounded-full bg-muted'>
          <CalendarClock className='h-5 w-5 text-muted-foreground' />
        </div>
        <div className='space-y-0.5'>
          <p className='text-sm font-medium text-foreground'>
            Belum ada aktivitas hari ini
          </p>
          <p className='text-xs text-muted-foreground'>
            Aktivitas absensi akan muncul di sini secara otomatis
          </p>
        </div>
        <Button asChild variant='outline' size='sm' className='mt-2 gap-2'>
          <Link to='/attendances/reports'>
            Lihat absensi sebelumnya
            <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='-mx-2 space-y-5'>
      {activeSessions.length > 0 && (
        <section>
          <SectionHeader
            label='Sedang bekerja'
            count={activeSessions.length}
            variant='active'
          />
          <ul className='divide-y divide-border/40'>
            {activeSessions.map((session: any) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </ul>
        </section>
      )}

      {completedSessions.length > 0 && (
        <section>
          <SectionHeader
            label='Selesai'
            count={completedSessions.length}
            variant='completed'
          />
          <ul className='divide-y divide-border/40'>
            {completedSessions.map((session: any) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </ul>
        </section>
      )}

      <div className='mx-2 border-t border-border/50 pt-2'>
        <Button
          asChild
          variant='ghost'
          size='sm'
          className='w-full justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground'
        >
          <Link to='/attendances/reports'>
            Lihat semua riwayat
            <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </Button>
      </div>
    </div>
  )
}
