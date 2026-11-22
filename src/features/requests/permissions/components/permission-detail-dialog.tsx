'use client'

import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import {
  Calendar,
  FileText,
  Hourglass,
  Wallet,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { leaveBalancesService } from '@/features/leave-balances/api/leave-balances.service'
import { type Permission } from '../data/schema'
import {
  PERMISSION_TYPE_LABEL,
  PermissionStatusBadge,
} from './permission-status-badge'
import { usePermissions } from './permissions-provider'

type PermissionDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Permission
}

export function PermissionDetailDialog({
  open,
  onOpenChange,
  currentRow,
}: PermissionDetailDialogProps) {
  const { setOpen } = usePermissions()
  const data = currentRow

  // Sisa cuti karyawan untuk tahun izin ini (GET /leave-balances/by-user/:userId)
  const userId = data.user?.id ?? data.userId
  const leaveYear = new Date(data.startDate).getFullYear()
  const balanceQuery = useQuery({
    queryKey: ['leave-balances', 'by-user', userId],
    queryFn: () => leaveBalancesService.getByUser(userId as string),
    enabled: open && !!userId,
    staleTime: 60_000,
  })
  const balance = balanceQuery.data?.find((b) => b.year === leaveYear)
  const balanceLabel = balanceQuery.isLoading
    ? 'Memuat...'
    : balanceQuery.isError
      ? 'Gagal memuat'
      : balance
        ? `${balance.remainingDays} dari ${balance.annualQuota + balance.carryOverDays} hari (${leaveYear})`
        : `Belum ada saldo ${leaveYear}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>Permission Request</DialogTitle>
          <DialogDescription>
            Review the request details before approving or rejecting.
          </DialogDescription>
        </DialogHeader>

        <div className='max-h-[60vh] space-y-4 overflow-y-auto pr-1'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold'>
                {data.user?.fullName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div className='text-sm font-medium'>
                  {data.user?.fullName ?? '-'}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {data.user?.employeeId ?? '-'} ·{' '}
                  {data.user?.department?.name ?? '-'}
                </div>
              </div>
            </div>
            <PermissionStatusBadge status={data.status} />
          </div>

          <Separator />

          <div className='grid grid-cols-2 gap-3 text-xs'>
            <InfoRow
              icon={FileText}
              label='Type'
              value={PERMISSION_TYPE_LABEL[data.type] ?? data.type}
            />
            <InfoRow
              icon={Calendar}
              label='Period'
              value={`${format(data.startDate, 'dd MMM yyyy')} → ${format(data.endDate, 'dd MMM yyyy')}`}
            />
            <InfoRow
              icon={UserIcon}
              label='Submitted'
              value={format(data.createdAt, 'dd MMM yyyy HH:mm')}
            />
            <InfoRow
              icon={Hourglass}
              label='Duration'
              value={data.duration != null ? `${data.duration} hari` : '-'}
            />
            <InfoRow icon={Wallet} label='Sisa Cuti' value={balanceLabel} />
          </div>

          <div>
            <div className='mb-1.5 text-[11px] font-bold tracking-widest text-muted-foreground uppercase'>
              Reason
            </div>
            <div className='rounded-md border bg-muted/30 p-3 text-xs whitespace-pre-wrap'>
              {data.reason || '-'}
            </div>
          </div>

          {data.attachmentUrl_url ? (
            <div>
              <div className='mb-1.5 text-[11px] font-bold tracking-widest text-muted-foreground uppercase'>
                Attachment
              </div>
              <a
                href={data.attachmentUrl_url}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs hover:bg-muted'
              >
                <FileText size={14} />
                Open attachment
              </a>
            </div>
          ) : null}

          {data.status !== 'PENDING' && data.approvedNote ? (
            <div>
              <div className='mb-1.5 text-[11px] font-bold tracking-widest text-muted-foreground uppercase'>
                Admin Note
              </div>
              <div className='rounded-md border bg-muted/30 p-3 text-xs'>
                {data.approvedNote}
              </div>
            </div>
          ) : null}

          {data.status !== 'PENDING' && data.approver ? (
            <div>
              <div className='mb-1.5 text-[11px] font-bold tracking-widest text-muted-foreground uppercase'>
                {data.status === 'APPROVED' ? 'Disetujui oleh' : 'Ditolak oleh'}
              </div>
              <div className='text-sm font-medium'>
                {data.approver.fullName}
              </div>
              {data.approvedAt ? (
                <div className='text-xs text-muted-foreground'>
                  {format(data.approvedAt, 'dd MMM yyyy HH:mm')}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <DialogFooter className='gap-2 sm:gap-2'>
          {data.status === 'PENDING' ? (
            <>
              <Button
                variant='outline'
                className='text-rose-600 hover:text-rose-600'
                onClick={() => setOpen('reject')}
              >
                Reject
              </Button>
              <Button onClick={() => setOpen('approve')}>Approve</Button>
            </>
          ) : (
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className='flex items-start gap-2 rounded-md border bg-muted/30 p-2.5'>
      <Icon size={14} className='mt-0.5 text-muted-foreground' />
      <div className='min-w-0'>
        <div className='text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
          {label}
        </div>
        <div className='truncate text-xs font-medium'>{value}</div>
      </div>
    </div>
  )
}
