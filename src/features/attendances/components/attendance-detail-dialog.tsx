'use client'

import { format } from 'date-fns'
import { getAssetUrl } from '@/lib/assets'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAttendanceDetail } from '../hooks/use-attendance-detail'

type AttendanceDetailDialogProps = {
  attendanceId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function fmt(dt?: string | null, pattern = 'dd MMM yyyy, HH:mm') {
  if (!dt) return '-'
  try {
    return format(new Date(dt), pattern)
  } catch {
    return '-'
  }
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='space-y-0.5'>
      <p className='text-[10px] font-semibold tracking-wide text-muted-foreground uppercase'>
        {label}
      </p>
      <p className='text-sm font-medium break-words'>{value ?? '-'}</p>
    </div>
  )
}

export function AttendanceDetailDialog({
  attendanceId,
  open,
  onOpenChange,
}: AttendanceDetailDialogProps) {
  const { detail, isLoading, isError } = useAttendanceDetail(
    open ? attendanceId : null
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>Detail Absensi</DialogTitle>
          <DialogDescription>
            {detail?.user?.fullName
              ? `${detail.user.fullName} • ${detail.user.employeeId ?? '-'}`
              : 'Rincian satu record kehadiran.'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='space-y-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-10 w-full rounded-md' />
            ))}
          </div>
        ) : isError || !detail ? (
          <p className='py-8 text-center text-sm text-muted-foreground'>
            Gagal memuat detail absensi.
          </p>
        ) : (
          <div className='space-y-5'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='outline'>{detail.status}</Badge>
              <Badge variant='outline'>{detail.workMode}</Badge>
              <Badge variant='outline'>{detail.method}</Badge>
              {detail.shiftName && (
                <Badge variant='outline'>{detail.shiftName}</Badge>
              )}
              {detail.isLocationValid != null && (
                <Badge
                  variant='outline'
                  className={
                    detail.isLocationValid
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }
                >
                  {detail.isLocationValid
                    ? 'Location valid'
                    : 'Location invalid'}
                </Badge>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
              <Field label='Tanggal' value={fmt(detail.date, 'dd MMM yyyy')} />
              <Field label='Check In' value={fmt(detail.checkIn)} />
              <Field label='Check Out' value={fmt(detail.checkOut)} />
              <Field
                label='Departemen'
                value={detail.user?.department?.name ?? '-'}
              />
              <Field label='Jabatan' value={detail.user?.position ?? '-'} />
              <Field label='Role' value={detail.user?.role ?? '-'} />
            </div>

            <Separator />

            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
              <Field
                label='Koordinat Masuk'
                value={
                  detail.latitudeIn != null && detail.longitudeIn != null
                    ? `${detail.latitudeIn.toFixed(5)}, ${detail.longitudeIn.toFixed(5)}`
                    : '-'
                }
              />
              <Field
                label='Koordinat Keluar'
                value={
                  detail.latitudeOut != null && detail.longitudeOut != null
                    ? `${detail.latitudeOut.toFixed(5)}, ${detail.longitudeOut.toFixed(5)}`
                    : '-'
                }
              />
              <Field
                label='Akurasi GPS'
                value={
                  detail.gpsAccuracyIn != null
                    ? `${Math.round(detail.gpsAccuracyIn)} m`
                    : '-'
                }
              />
              <Field label='Perangkat' value={detail.deviceInfo ?? '-'} />
              <Field label='IP Address' value={detail.ipAddress ?? '-'} />
              <Field label='Catatan' value={detail.note ?? '-'} />
            </div>

            {(detail.photoIn ||
              detail.photoOut ||
              detail.watermarkedIn ||
              detail.watermarkedOut) && (
              <>
                <Separator />
                <div className='space-y-2'>
                  <p className='text-[10px] font-semibold tracking-wide text-muted-foreground uppercase'>
                    Foto
                  </p>
                  <div className='grid grid-cols-2 gap-3'>
                    <PhotoBox
                      label='Masuk'
                      src={detail.watermarkedIn || detail.photoIn}
                    />
                    <PhotoBox
                      label='Keluar'
                      src={detail.watermarkedOut || detail.photoOut}
                    />
                  </div>
                </div>
              </>
            )}

            {detail.permission && (
              <>
                <Separator />
                <div className='space-y-2'>
                  <p className='text-[10px] font-semibold tracking-wide text-muted-foreground uppercase'>
                    Izin Terkait
                  </p>
                  <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                    <Field label='Tipe' value={detail.permission.type} />
                    <Field label='Status' value={detail.permission.status} />
                    <Field
                      label='Durasi'
                      value={`${detail.permission.duration ?? '-'} hari`}
                    />
                    <Field
                      label='Mulai'
                      value={fmt(detail.permission.startDate, 'dd MMM yyyy')}
                    />
                    <Field
                      label='Selesai'
                      value={fmt(detail.permission.endDate, 'dd MMM yyyy')}
                    />
                    <Field
                      label='Alasan'
                      value={detail.permission.reason ?? '-'}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PhotoBox({ label, src }: { label: string; src?: string | null }) {
  const url = getAssetUrl(src)
  return (
    <div className='space-y-1'>
      <p className='text-[10px] font-medium text-muted-foreground'>{label}</p>
      {url ? (
        <a href={url} target='_blank' rel='noreferrer'>
          <img
            src={url}
            alt={`Foto ${label}`}
            className='aspect-square w-full rounded-lg border object-cover'
          />
        </a>
      ) : (
        <div className='flex aspect-square w-full items-center justify-center rounded-lg border bg-muted text-[11px] text-muted-foreground'>
          Tidak ada
        </div>
      )}
    </div>
  )
}
