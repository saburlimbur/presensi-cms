import { getRouteApi } from '@tanstack/react-router'
import { ClockIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAllUserAttendance } from '@/features/attendances/hooks/use-all-user-attendance'
import { useUserAttendanceToday } from '@/features/attendances/hooks/use-user-attendance-today'
import useGetEmployee from '@/features/employees/hooks/use-get-employee'

const route = getRouteApi('/_authenticated/')

export function RecentAttendance() {
  const { allUserAttendance, isLoading: isLoadingAttendance } =
    useAllUserAttendance()

  const sortedAttendance = allUserAttendance
    ? [...allUserAttendance?.data].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    : []

  const RenderSkeleton = () => (
    <div className='space-y-4'>
      {[...Array(5)].map((_, i) => (
        <div key={i} className='flex items-center gap-4'>
          <Skeleton className='h-9 w-9 rounded-full' />
          <div className='flex flex-1 justify-between'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-37.5' />
              <Skeleton className='h-3 w-25' />
            </div>
            <Skeleton className='w-20d h-6' />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className='space-y-4'>
      {isLoadingAttendance ? (
        <RenderSkeleton />
      ) : sortedAttendance.length === 0 ? (
        <p className='text-center text-sm text-muted-foreground'>
          Belum ada data absen hari ini.
        </p>
      ) : (
        sortedAttendance.map((attendance) => {
          const { id, user, createdAt } = attendance

          return (
            <div
              key={id}
              className='group relative flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-muted/50'
            >
              <div className='relative'>
                <Avatar className='h-11 w-11 border-2 border-background shadow-sm'>
                  <AvatarImage src='' alt={user?.fullName} />
                  <AvatarFallback className='bg-primary/10 font-bold text-primary'>
                    {user?.fullName?.substring(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <span className='absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-background bg-green-500' />
              </div>

              <div className='flex flex-1 items-center justify-between overflow-hidden'>
                <div className='flex min-w-0 flex-col'>
                  <p className='truncate text-sm leading-none font-bold text-foreground'>
                    {user?.fullName}
                  </p>
                  <p className='mt-1 truncate text-xs text-muted-foreground'>
                    {user?.email}
                  </p>
                  <div className='mt-1.5 flex items-center gap-2'>
                    <Badge variant='secondary'>
                      {user?.department?.name || '-'}
                    </Badge>
                  </div>
                </div>

                <div className='flex flex-col items-end gap-1.5'>
                  <span className='text-[10px] font-medium tracking-tight text-muted-foreground uppercase'>
                    {attendance?.method}
                  </span>
                  <div className='flex items-center gap-1.5 text-sm font-semibold text-primary'>
                    <ClockIcon className='h-3 w-3' />
                    {new Date(createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
