import { format } from 'date-fns'
import { ArrowUpRight, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Permission } from '../data/schema'
import {
  PERMISSION_TYPE_LABEL,
  PermissionStatusBadge,
} from './permission-status-badge'
import { usePermissions } from './permissions-provider'

export function PermissionsTable({ data }: { data: Permission[] }) {
  const { setOpen, setCurrentRow } = usePermissions()

  return (
    <div className='overflow-hidden rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/40 hover:bg-muted/40'>
            <TableHead className='pl-4'>Employee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Attachment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='pr-4 text-right'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center'>
                No permission requests.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className='pl-4'>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-xs font-medium'>
                      {row.user?.fullName ?? '-'}
                    </span>
                    <span className='text-[11px] text-muted-foreground'>
                      {row.user?.employeeId ?? '-'} ·{' '}
                      {row.user?.department?.code ?? '-'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='text-xs'>
                  {PERMISSION_TYPE_LABEL[row.type] ?? row.type}
                </TableCell>
                <TableCell className='text-xs whitespace-nowrap'>
                  {format(row.startDate, 'dd MMM')} →{' '}
                  {format(row.endDate, 'dd MMM yyyy')}
                </TableCell>
                <TableCell className='max-w-[220px] text-xs text-muted-foreground'>
                  <span className='line-clamp-1'>{row.reason}</span>
                </TableCell>
                <TableCell>
                  {row.attachmentUrl ? (
                    <a
                      href={row.attachmentUrl}
                      target='_blank'
                      rel='noreferrer'
                      className={cn(
                        'inline-flex items-center gap-1 text-[11px] text-foreground hover:underline'
                      )}
                    >
                      <FileText size={12} />
                      View
                    </a>
                  ) : (
                    <span className='text-[11px] text-muted-foreground'>
                      None
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <PermissionStatusBadge status={row.status} />
                </TableCell>
                <TableCell className='pr-4 text-right'>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='h-7 gap-1.5 text-xs'
                    onClick={() => {
                      setCurrentRow(row)
                      setOpen('detail')
                    }}
                  >
                    Detail
                    <ArrowUpRight size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
