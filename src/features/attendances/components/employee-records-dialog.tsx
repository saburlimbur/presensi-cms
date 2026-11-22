import { useState } from 'react'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAttendanceRecords } from '../hooks/use-attendance-records'
import { AttendanceDetailDialog } from './attendance-detail-dialog'
import { ManualAttendanceDialog } from './manual-attendance-dialog'

type EmployeeRecordsDialogProps = {
  userId: string | null
  employeeName?: string
  dateFrom: string
  dateTo: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function fmt(dt?: string | null, pattern = 'HH:mm') {
  if (!dt) return '-'
  try {
    return format(new Date(dt), pattern)
  } catch {
    return '-'
  }
}

export function EmployeeRecordsDialog({
  userId,
  employeeName,
  dateFrom,
  dateTo,
  open,
  onOpenChange,
}: EmployeeRecordsDialogProps) {
  const [manualOpen, setManualOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <DialogTitle>Riwayat Absensi</DialogTitle>
              <DialogDescription>
                {employeeName ?? 'Karyawan'} • {dateFrom} s/d {dateTo}
              </DialogDescription>
            </div>
            {userId && (
              <Button
                size='sm'
                className='h-8 shrink-0'
                onClick={() => setManualOpen(true)}
              >
                <Plus className='h-4 w-4' /> Absensi Manual
              </Button>
            )}
          </div>
        </DialogHeader>

        {open && userId && (
          <RecordsList userId={userId} dateFrom={dateFrom} dateTo={dateTo} />
        )}

        {userId && (
          <ManualAttendanceDialog
            userId={userId}
            employeeName={employeeName}
            open={manualOpen}
            onOpenChange={setManualOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function RecordsList({
  userId,
  dateFrom,
  dateTo,
}: {
  userId: string
  dateFrom: string
  dateTo: string
}) {
  const { records, isLoading } = useAttendanceRecords({
    userId,
    dateFrom,
    dateTo,
    limit: 100,
  })
  const [detailId, setDetailId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-10 w-full rounded-md' />
        ))}
      </div>
    )
  }

  if (!records.length) {
    return (
      <p className='py-8 text-center text-sm text-muted-foreground'>
        Tidak ada record absensi pada periode ini.
      </p>
    )
  }

  return (
    <>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/40 hover:bg-muted/40'>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Masuk</TableHead>
              <TableHead>Keluar</TableHead>
              <TableHead className='text-right'>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((rec) => (
              <TableRow key={rec.id}>
                <TableCell className='text-xs'>
                  {fmt(rec.date, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant='outline' className='text-[11px]'>
                    {rec.status}
                  </Badge>
                </TableCell>
                <TableCell className='font-mono text-xs tabular-nums'>
                  {fmt(rec.checkIn)}
                </TableCell>
                <TableCell className='font-mono text-xs tabular-nums'>
                  {fmt(rec.checkOut)}
                </TableCell>
                <TableCell className='text-right'>
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
            ))}
          </TableBody>
        </Table>
      </div>

      <AttendanceDetailDialog
        attendanceId={detailId}
        open={!!detailId}
        onOpenChange={(o) => !o && setDetailId(null)}
      />
    </>
  )
}
