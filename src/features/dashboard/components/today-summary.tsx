import { CheckCircle2, Clock, FileText, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTodaySummary } from '../hooks/use-today-summary'

const TILES = [
  {
    key: 'hadir',
    label: 'Hadir',
    icon: CheckCircle2,
    className: 'text-emerald-600 dark:text-emerald-400',
    pick: (s: TileSource) => s.PRESENT + s.WORK_FROM_HOME,
  },
  {
    key: 'telat',
    label: 'Telat',
    icon: Clock,
    className: 'text-amber-600 dark:text-amber-400',
    pick: (s: TileSource) => s.LATE,
  },
  {
    key: 'izin',
    label: 'Izin / Cuti',
    icon: FileText,
    className: 'text-blue-600 dark:text-blue-400',
    pick: (s: TileSource) => s.PERMIT + s.SICK + s.ON_LEAVE,
  },
  {
    key: 'absen',
    label: 'Absen',
    icon: XCircle,
    className: 'text-red-600 dark:text-red-400',
    pick: (s: TileSource) => s.ABSENT,
  },
] as const

type TileSource = {
  PRESENT: number
  LATE: number
  ABSENT: number
  SICK: number
  PERMIT: number
  ON_LEAVE: number
  HOLIDAY: number
  WORK_FROM_HOME: number
}

export function TodaySummary() {
  const { summary, isLoading } = useTodaySummary()

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <div className='space-y-1'>
          <CardTitle>Ringkasan Hari Ini</CardTitle>
          <CardDescription>
            {isLoading ? 'Memuat…' : (summary?.date ?? '-')}
          </CardDescription>
        </div>
        <div className='text-right'>
          <p className='text-2xl font-bold tabular-nums'>
            {isLoading ? (
              <Skeleton className='h-7 w-10' />
            ) : (
              (summary?.total ?? 0)
            )}
          </p>
          <p className='text-xs text-muted-foreground'>total absensi</p>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {TILES.map((tile) => {
            const Icon = tile.icon
            return (
              <div
                key={tile.key}
                className='rounded-lg border bg-muted/30 p-3'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-medium text-muted-foreground'>
                    {tile.label}
                  </span>
                  <Icon className={cn('h-4 w-4', tile.className)} />
                </div>
                <p className='mt-1 text-2xl font-bold tabular-nums'>
                  {isLoading ? (
                    <Skeleton className='h-7 w-8' />
                  ) : summary ? (
                    tile.pick(summary.byStatus)
                  ) : (
                    0
                  )}
                </p>
              </div>
            )
          })}
        </div>

        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          <span>
            WFO{' '}
            <span className='font-semibold text-foreground tabular-nums'>
              {isLoading ? '—' : (summary?.byWorkMode.WFO ?? 0)}
            </span>
          </span>
          <span>
            WFA{' '}
            <span className='font-semibold text-foreground tabular-nums'>
              {isLoading ? '—' : (summary?.byWorkMode.WFA ?? 0)}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
