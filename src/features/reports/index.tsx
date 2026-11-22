import { useMemo, useState } from 'react'
import { addDays, format, startOfMonth, startOfWeek } from 'date-fns'
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileSpreadsheet,
  HeartPulse,
  Home,
  PlaneTakeoff,
  RefreshCw,
  Search as SearchIcon,
  Timer,
  Users,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationDropdown } from '@/components/notification-dropdown'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { EmployeeRecordsDialog } from '@/features/attendances/components/employee-records-dialog'
import { useAllUserAttendanceToExcel } from '@/features/attendances/hooks/use-all-user-attendance-to-excel'
import useGetAllDepartments from '@/features/departments/hooks/useGetAllDepartments'
import { ReportsChart } from './components/reports-chart'
import { ReportsFilter } from './components/reports-filter'
import { GRANULARITY_OPTIONS, MONTHS } from './data/schema'
import { useMonthlyReports } from './hooks/use-monthly-report'
import { useRangeReports } from './hooks/use-range-report'
import { useWeeklyReports } from './hooks/use-weekly-report'
import type {
  AttendanceRecapResponse,
  EmployeeAttendanceDetail,
  Granularity,
} from './types/types'

const toISODate = (d: Date) => format(d, 'yyyy-MM-dd')

function Reports() {
  const now = new Date()

  // ---- Filter state ----
  const [granularity, setGranularity] = useState<Granularity>('monthly')

  // Monthly state
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  // Weekly state — default ke awal minggu ini (Sen)
  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(now, { weekStartsOn: 1 })
  )

  // Range state — default 30 hari terakhir
  const [rangeFrom, setRangeFrom] = useState<Date>(addDays(now, -29))
  const [rangeTo, setRangeTo] = useState<Date>(now)

  const [departmentId, setDepartmentId] = useState<string>('all')
  const [search, setSearch] = useState('')

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Employee terpilih untuk melihat rincian record absensinya (dialog).
  const [recordsFor, setRecordsFor] = useState<{
    userId: string
    name: string
  } | null>(null)

  // ---- Queries ----
  const departmentsQuery = useGetAllDepartments()
  const departments: Array<{ id: string; name: string; code: string }> =
    departmentsQuery.data ?? []

  const deptParam = departmentId !== 'all' ? { departmentId } : {}

  const monthlyQuery = useMonthlyReports({ month, year, ...deptParam })
  const weeklyQuery = useWeeklyReports({
    weekStart: toISODate(weekStart),
    ...deptParam,
  })
  const rangeQuery = useRangeReports({
    from: toISODate(rangeFrom),
    to: toISODate(rangeTo),
    ...deptParam,
  })

  const activeQuery =
    granularity === 'monthly'
      ? monthlyQuery
      : granularity === 'weekly'
        ? weeklyQuery
        : rangeQuery

  const recap = (activeQuery.data as AttendanceRecapResponse | undefined)?.data
  const summary = recap?.summary
  const details = recap?.details

  // ---- Date range untuk export Excel ----
  const exportRange = useMemo(() => {
    if (granularity === 'monthly') {
      const start = startOfMonth(new Date(year, month - 1, 1))
      const end = new Date(year, month, 0)
      return { dateFrom: toISODate(start), dateTo: toISODate(end) }
    }
    if (granularity === 'weekly') {
      const end = addDays(weekStart, 6)
      return { dateFrom: toISODate(weekStart), dateTo: toISODate(end) }
    }
    return { dateFrom: toISODate(rangeFrom), dateTo: toISODate(rangeTo) }
  }, [granularity, month, year, weekStart, rangeFrom, rangeTo])

  // ---- Period label ----
  const periodLabel = useMemo(() => {
    if (granularity === 'monthly') {
      const m = MONTHS.find((mo) => mo.value === month)?.label ?? ''
      return `${m} ${year}`
    }
    if (granularity === 'weekly') {
      const end = addDays(weekStart, 6)
      return `${format(weekStart, 'dd MMM')} – ${format(end, 'dd MMM yyyy')}`
    }
    return `${format(rangeFrom, 'dd MMM yyyy')} – ${format(rangeTo, 'dd MMM yyyy')}`
  }, [granularity, month, year, weekStart, rangeFrom, rangeTo])

  // ---- Filtered details (client-side search by name/empId) ----
  const filteredDetails = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return details ?? []
    return (details ?? []).filter(
      (d) =>
        d.fullName.toLowerCase().includes(q) ||
        d.employeeId.toLowerCase().includes(q)
    )
  }, [details, search])

  // ---- Client-side pagination ----
  const totalRows = filteredDetails.length
  const totalPages = Math.max(1, Math.ceil(totalRows / limit))
  const safePage = Math.min(page, totalPages)
  const pageRows = useMemo(
    () =>
      filteredDetails.slice(
        (safePage - 1) * limit,
        (safePage - 1) * limit + limit
      ),
    [filteredDetails, safePage, limit]
  )

  // ---- Handlers ----
  const exportExcel = useAllUserAttendanceToExcel()

  const onRefresh = () => activeQuery.refetch()

  const onGranularityChange = (g: string) => {
    setGranularity(g as Granularity)
    setPage(1)
  }

  const resetFilters = () => {
    setSearch('')
    setDepartmentId('all')
    setPage(1)
  }

  const isLoading = activeQuery.isLoading
  const isFetching = activeQuery.isFetching

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        {/* Title row */}
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div className='space-y-0.5'>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              Laporan Kehadiran
            </h1>
            <p className='text-sm text-muted-foreground'>
              Rekap kehadiran karyawan per periode — bulanan, mingguan, atau
              rentang tanggal.
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={onRefresh}
              disabled={isFetching}
              className='gap-2'
            >
              <RefreshCw
                size={14}
                className={cn(isFetching && 'animate-spin')}
              />
              Refresh
            </Button>
            <Button
              size='sm'
              className='gap-2'
              onClick={() =>
                exportExcel.mutate({
                  ...exportRange,
                  ...(departmentId !== 'all' ? { departmentId } : {}),
                })
              }
              disabled={exportExcel.isPending}
            >
              {exportExcel.isPending ? (
                <RefreshCw size={14} className='animate-spin' />
              ) : (
                <FileSpreadsheet size={14} />
              )}
              Export Excel
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <Card className='p-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <Tabs value={granularity} onValueChange={onGranularityChange}>
              <TabsList>
                {GRANULARITY_OPTIONS.map((g) => (
                  <TabsTrigger key={g.value} value={g.value}>
                    {g.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Separator orientation='vertical' className='h-7' />

            {granularity === 'monthly' && (
              <ReportsFilter
                granularity='monthly'
                month={month}
                year={year}
                onMonthChange={(m) => {
                  setMonth(m)
                  setPage(1)
                }}
                onYearChange={(y) => {
                  setYear(y)
                  setPage(1)
                }}
              />
            )}
            {granularity === 'weekly' && (
              <ReportsFilter
                granularity='weekly'
                weekStart={weekStart}
                onWeekStartChange={(d) => {
                  setWeekStart(d)
                  setPage(1)
                }}
              />
            )}
            {granularity === 'range' && (
              <ReportsFilter
                granularity='range'
                from={rangeFrom}
                to={rangeTo}
                onFromChange={(d) => {
                  setRangeFrom(d)
                  if (rangeTo < d) setRangeTo(d)
                  setPage(1)
                }}
                onToChange={(d) => {
                  setRangeTo(d)
                  setPage(1)
                }}
              />
            )}

            <Separator orientation='vertical' className='h-7' />

            <Select
              value={departmentId}
              onValueChange={(v) => {
                setDepartmentId(v)
                setPage(1)
              }}
              disabled={departmentsQuery.isLoading}
            >
              <SelectTrigger size='sm' className='w-[200px]'>
                <SelectValue placeholder='Departemen' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Departemen</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className='ms-auto flex items-center gap-2 text-xs text-muted-foreground'>
              <Badge variant='outline' className='gap-1.5'>
                <CalendarDays size={12} />
                {periodLabel}
              </Badge>
              {recap?.period && 'workDays' in recap.period && (
                <Badge variant='outline' className='gap-1.5'>
                  <Briefcase size={12} />
                  {recap.period.workDays} hari kerja
                </Badge>
              )}
              {summary && (
                <Badge variant='outline' className='gap-1.5'>
                  <Users size={12} />
                  {summary.totalEmployees} karyawan
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Stat cards — 6 metric status */}
        <div className='grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6'>
          <StatCard
            label='Hadir'
            value={summary?.totalPresent}
            isLoading={isLoading}
            icon={CheckCircle2}
            tone='success'
          />
          <StatCard
            label='Terlambat'
            value={summary?.totalLate}
            isLoading={isLoading}
            icon={Timer}
            tone='warning'
          />
          <StatCard
            label='Tidak Hadir'
            value={summary?.totalAbsent}
            isLoading={isLoading}
            icon={XCircle}
            tone='danger'
          />
          <StatCard
            label='Izin / Sakit'
            value={summary?.totalPermit}
            isLoading={isLoading}
            icon={HeartPulse}
            tone='info'
          />
          <StatCard
            label='Cuti'
            value={summary?.totalLeave}
            isLoading={isLoading}
            icon={PlaneTakeoff}
            tone='violet'
          />
          <StatCard
            label='WFH'
            value={summary?.totalWfh}
            isLoading={isLoading}
            icon={Home}
            tone='sky'
          />
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Kehadiran</CardTitle>
            <CardDescription>{periodLabel}</CardDescription>
          </CardHeader>
          <CardContent className='px-2 sm:px-4'>
            <ReportsChart summary={summary} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Aggregate per-employee table */}
        <Card className='overflow-hidden p-0'>
          <div className='border-b p-4'>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='relative min-w-[240px] flex-1'>
                <SearchIcon
                  size={14}
                  className='absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'
                />
                <Input
                  placeholder='Cari nama atau Employee ID…'
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className='pl-9'
                />
              </div>
              {(search || departmentId !== 'all') && (
                <Button variant='ghost' size='sm' onClick={resetFilters}>
                  Reset
                </Button>
              )}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className='bg-muted/40 hover:bg-muted/40'>
                <TableHead className='pl-4'>Karyawan</TableHead>
                <TableHead className='text-center'>Hadir</TableHead>
                <TableHead className='text-center'>Terlambat</TableHead>
                <TableHead className='text-center'>Absen</TableHead>
                <TableHead className='text-center'>Izin / Sakit</TableHead>
                <TableHead className='text-center'>Cuti</TableHead>
                <TableHead className='text-center'>WFH</TableHead>
                <TableHead className='pr-4 text-right'>
                  <span className='inline-flex items-center gap-1'>
                    <Clock size={12} />
                    Total Jam
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: limit }).map((_, i) => (
                  <RowSkeleton key={i} />
                ))
              ) : pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='py-16 text-center'>
                    <EmptyState onReset={resetFilters} />
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row) => (
                  <DetailRow
                    key={row.userId}
                    row={row}
                    onOpen={() =>
                      setRecordsFor({ userId: row.userId, name: row.fullName })
                    }
                  />
                ))
              )}
            </TableBody>
          </Table>

          <Separator />

          <div className='flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-muted-foreground'>
            <div className='flex items-center gap-3'>
              <span>
                Menampilkan{' '}
                <span className='font-semibold text-foreground'>
                  {pageRows.length}
                </span>{' '}
                dari{' '}
                <span className='font-semibold text-foreground'>
                  {totalRows}
                </span>{' '}
                karyawan
              </span>
              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(Number(v))
                  setPage(1)
                }}
              >
                <SelectTrigger size='sm' className='h-7 w-[78px] text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center gap-2'>
              <span>
                Halaman{' '}
                <span className='font-semibold text-foreground'>
                  {safePage}
                </span>{' '}
                dari {totalPages}
              </span>
              <Button
                variant='outline'
                size='icon'
                className='h-7 w-7'
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-7 w-7'
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </Card>

        <EmployeeRecordsDialog
          userId={recordsFor?.userId ?? null}
          employeeName={recordsFor?.name}
          dateFrom={exportRange.dateFrom}
          dateTo={exportRange.dateTo}
          open={!!recordsFor}
          onOpenChange={(o) => !o && setRecordsFor(null)}
        />
      </Main>
    </>
  )
}

/* -------------------- Subcomponents -------------------- */

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'sky'

const TONE_MAP: Record<Tone, string> = {
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
}

function StatCard({
  label,
  value,
  isLoading,
  icon: Icon,
  tone,
}: {
  label: string
  value: number | undefined
  isLoading?: boolean
  icon: LucideIcon
  tone: Tone
}) {
  return (
    <Card className='flex flex-row items-center justify-between gap-3 p-4'>
      <div className='space-y-1'>
        <p className='text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
          {label}
        </p>
        {isLoading ? (
          <Skeleton className='h-7 w-12' />
        ) : (
          <p className='text-2xl font-bold tracking-tight tabular-nums'>
            {value ?? 0}
          </p>
        )}
      </div>
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl',
          TONE_MAP[tone]
        )}
      >
        <Icon size={18} />
      </div>
    </Card>
  )
}

function DetailRow({
  row,
  onOpen,
}: {
  row: EmployeeAttendanceDetail
  onOpen: () => void
}) {
  const initials = row.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <TableRow>
      <TableCell className='pl-4'>
        <button
          type='button'
          onClick={onOpen}
          className='flex items-center gap-3 text-start transition-opacity hover:opacity-80'
        >
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold'>
            {initials}
          </div>
          <div className='flex min-w-0 flex-col gap-1'>
            <span className='truncate text-xs leading-none font-medium'>
              {row.fullName}
            </span>
            <span className='truncate text-[11px] text-muted-foreground'>
              {row.employeeId} • {row.department ?? '-'}
              {row.position ? ` • ${row.position}` : ''}
            </span>
          </div>
        </button>
      </TableCell>
      <CountCell value={row.present} tone='success' />
      <CountCell value={row.late} tone='warning' />
      <CountCell value={row.absent} tone='danger' />
      <CountCell value={row.permit} tone='info' />
      <CountCell value={row.leave} tone='violet' />
      <CountCell value={row.wfh} tone='sky' />
      <TableCell className='pr-4 text-right'>
        <span className='font-mono text-xs tabular-nums'>
          {row.totalWorkHours.toFixed(1)}h
        </span>
      </TableCell>
    </TableRow>
  )
}

function CountCell({ value, tone }: { value: number; tone: Tone }) {
  if (!value) {
    return (
      <TableCell className='text-center text-xs text-muted-foreground'>
        0
      </TableCell>
    )
  }
  return (
    <TableCell className='text-center'>
      <span
        className={cn(
          'inline-flex h-6 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular-nums',
          TONE_MAP[tone]
        )}
      >
        {value}
      </span>
    </TableCell>
  )
}

function RowSkeleton() {
  return (
    <TableRow>
      <TableCell className='pl-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-8 w-8 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-3 w-28' />
            <Skeleton className='h-2.5 w-20' />
          </div>
        </div>
      </TableCell>
      {Array.from({ length: 7 }).map((_, i) => (
        <TableCell key={i} className='text-center'>
          <Skeleton className='mx-auto h-3 w-8' />
        </TableCell>
      ))}
    </TableRow>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className='flex flex-col items-center gap-3'>
      <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-muted'>
        <CalendarDays className='h-7 w-7 text-muted-foreground' />
      </div>
      <div className='space-y-1'>
        <p className='text-sm font-semibold text-foreground'>
          Belum ada data karyawan
        </p>
        <p className='text-xs text-muted-foreground'>
          Coba ubah periode atau filter departemen.
        </p>
      </div>
      <Button variant='outline' size='sm' onClick={onReset}>
        Reset Filter
      </Button>
    </div>
  )
}

export default Reports
