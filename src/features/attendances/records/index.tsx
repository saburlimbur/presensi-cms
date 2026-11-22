import { useState } from 'react'
import { format, startOfMonth } from 'date-fns'
import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationDropdown } from '@/components/notification-dropdown'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { type Department } from '@/features/departments/components/departments-columns'
import useGetAllDepartments from '@/features/departments/hooks/useGetAllDepartments'
import {
  STATUS_OPTIONS,
  WORK_MODE_OPTIONS,
} from '@/features/reports/data/schema'
import { type AttendanceListParams } from '../api/attendance.api'
import { AttendanceDetailDialog } from '../components/attendance-detail-dialog'
import { useAllUserAttendanceToExcel } from '../hooks/use-all-user-attendance-to-excel'
import { useAttendanceRecords } from '../hooks/use-attendance-records'
import { SHIFT_NAME_OPTIONS } from '../shifts/data/schema'

const DATE_FORMAT = 'yyyy-MM-dd'
const PAGE_SIZE = 20

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label])
)

function fmt(dt: string | null | undefined, pattern: string) {
  if (!dt) return '-'
  try {
    return format(new Date(dt), pattern)
  } catch {
    return '-'
  }
}

export default function AttendanceRecords() {
  const today = new Date()
  const [dateFrom, setDateFrom] = useState(
    format(startOfMonth(today), DATE_FORMAT)
  )
  const [dateTo, setDateTo] = useState(format(today, DATE_FORMAT))
  const [status, setStatus] = useState('all')
  const [workMode, setWorkMode] = useState('all')
  const [shiftName, setShiftName] = useState('all')
  const [departmentId, setDepartmentId] = useState('all')
  const [page, setPage] = useState(1)
  const [detailId, setDetailId] = useState<string | null>(null)

  const { data: departments } = useGetAllDepartments()
  const exportExcel = useAllUserAttendanceToExcel()

  // Backend (adminListQuerySchema / adminExportQuerySchema) menolak dateTo yang
  // lebih awal dari dateFrom, dan export mewajibkan keduanya terisi — jadi
  // rentang hanya dikirim kalau lengkap dan urut.
  const hasRange = !!dateFrom && !!dateTo
  const isRangeInvalid = hasRange && dateTo < dateFrom
  const canQueryRange = hasRange && !isRangeInvalid

  // Filter yang sama dipakai untuk tabel dan export supaya isi file = isi layar.
  const filters: AttendanceListParams = {
    ...(canQueryRange ? { dateFrom, dateTo } : {}),
    ...(status !== 'all' ? { status } : {}),
    ...(workMode !== 'all' ? { workMode } : {}),
    ...(shiftName !== 'all' ? { shiftName } : {}),
    ...(departmentId !== 'all' ? { departmentId } : {}),
  }

  const { records, pagination, isLoading, isFetching, refetch } =
    useAttendanceRecords({ ...filters, page, limit: PAGE_SIZE })

  const total = pagination?.total ?? 0
  const totalPages = pagination?.totalPages ?? 1

  // Setiap perubahan filter kembali ke halaman 1.
  const change = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setPage(1)
  }

  const resetFilters = () => {
    setDateFrom(format(startOfMonth(today), DATE_FORMAT))
    setDateTo(format(today, DATE_FORMAT))
    setStatus('all')
    setWorkMode('all')
    setShiftName('all')
    setDepartmentId('all')
    setPage(1)
  }

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

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Attendance Records
            </h2>
            <p className='text-muted-foreground'>
              Riwayat kehadiran seluruh karyawan. Klik Detail untuk melihat
              foto, titik GPS, dan info perangkat.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='gap-2'
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                size={14}
                className={isFetching ? 'animate-spin' : undefined}
              />
              Refresh
            </Button>
            <Button
              size='sm'
              className='gap-2'
              disabled={!canQueryRange || exportExcel.isPending}
              onClick={() =>
                exportExcel.mutate(filters, {
                  onError: (err) =>
                    toast.error(getErrorMessage(err, 'Gagal export Excel')),
                })
              }
            >
              {exportExcel.isPending ? (
                <Loader2 size={14} className='animate-spin' />
              ) : (
                <FileSpreadsheet size={14} />
              )}
              Export Excel
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <Card className='p-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Input
              type='date'
              aria-label='Dari tanggal'
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => change(setDateFrom)(e.target.value)}
              className='w-[150px]'
            />
            <span className='text-xs text-muted-foreground'>s/d</span>
            <Input
              type='date'
              aria-label='Sampai tanggal'
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => change(setDateTo)(e.target.value)}
              className='w-[150px]'
            />

            <Select value={status} onValueChange={change(setStatus)}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={workMode} onValueChange={change(setWorkMode)}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder='Mode kerja' />
              </SelectTrigger>
              <SelectContent>
                {WORK_MODE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={shiftName} onValueChange={change(setShiftName)}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Shift' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Shift</SelectItem>
                {SHIFT_NAME_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={departmentId}
              onValueChange={change(setDepartmentId)}
            >
              <SelectTrigger className='w-[190px]'>
                <SelectValue placeholder='Departemen' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua Departemen</SelectItem>
                {(departments ?? []).map((dept: Department) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant='ghost' size='sm' onClick={resetFilters}>
              Reset
            </Button>
          </div>
          {isRangeInvalid && (
            <p className='mt-2 text-xs text-destructive'>
              Tanggal akhir lebih awal dari tanggal mulai.
            </p>
          )}
          {!hasRange && (
            <p className='mt-2 text-xs text-muted-foreground'>
              Isi kedua tanggal untuk memfilter periode dan mengaktifkan export.
            </p>
          )}
        </Card>

        {/* Table */}
        <Card className='overflow-hidden p-0'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/40 hover:bg-muted/40'>
                <TableHead className='pl-4'>Tanggal</TableHead>
                <TableHead>Karyawan</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Masuk</TableHead>
                <TableHead>Keluar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead className='pr-4 text-right'>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className='h-24 text-center'>
                    <Loader2 className='mx-auto h-4 w-4 animate-spin text-muted-foreground' />
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className='h-24 text-center text-sm text-muted-foreground'
                  >
                    Tidak ada record absensi untuk filter ini.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className='pl-4 text-xs whitespace-nowrap'>
                      {fmt(rec.date, 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-xs font-medium'>
                          {rec.user?.fullName ?? '-'}
                        </span>
                        <span className='text-[11px] text-muted-foreground'>
                          {rec.user?.employeeId ?? '-'} ·{' '}
                          {rec.user?.department?.code ?? '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-xs'>
                      {rec.shiftName ?? '-'}
                    </TableCell>
                    <TableCell className='font-mono text-xs tabular-nums'>
                      {fmt(rec.checkIn, 'HH:mm')}
                    </TableCell>
                    <TableCell className='font-mono text-xs tabular-nums'>
                      {fmt(rec.checkOut, 'HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='text-[11px]'>
                        {STATUS_LABEL[rec.status] ?? rec.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-xs'>{rec.workMode}</TableCell>
                    <TableCell className='text-xs'>
                      {rec.method ?? '-'}
                    </TableCell>
                    <TableCell className='text-xs'>
                      {rec.isLocationValid == null
                        ? '-'
                        : rec.isLocationValid
                          ? 'Valid'
                          : 'Tidak valid'}
                    </TableCell>
                    <TableCell className='pr-4 text-right'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-7'
                        onClick={() => setDetailId(rec.id)}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className='flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground'>
          <span>
            {total} record · halaman {page} dari {totalPages}
          </span>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='h-8 gap-1'
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} />
              Sebelumnya
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-8 gap-1'
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </Main>

      <AttendanceDetailDialog
        attendanceId={detailId}
        open={!!detailId}
        onOpenChange={(o) => !o && setDetailId(null)}
      />
    </>
  )
}
