import { type ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/data-table'
import { type LeaveBalance } from '../data/schema'
import { useLeaveBalances } from './leave-balances-provider'

export const leaveBalancesColumns: ColumnDef<LeaveBalance>[] = [
  {
    id: 'employee',
    accessorFn: (row) =>
      `${row.user?.fullName ?? ''} ${row.user?.employeeId ?? ''}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Employee' />
    ),
    cell: ({ row }) => {
      const { user, userId } = row.original
      if (!user) {
        return (
          <span className='font-mono text-[11px] text-muted-foreground'>
            {userId}
          </span>
        )
      }
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='text-xs font-medium'>{user.fullName}</span>
          <span className='font-mono text-[10px] text-muted-foreground'>
            {user.employeeId}
            {user.department?.code ? ` · ${user.department.code}` : ''}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) =>
      String(row.getValue(id))
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  },
  {
    accessorKey: 'year',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Year' />
    ),
    cell: ({ row }) => (
      <span className='text-xs tabular-nums'>{row.getValue('year')}</span>
    ),
  },
  {
    accessorKey: 'annualQuota',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Annual Quota' />
    ),
    cell: ({ row }) => (
      <span className='text-xs tabular-nums'>
        {row.getValue('annualQuota')}
      </span>
    ),
  },
  {
    accessorKey: 'usedDays',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Used' />
    ),
    cell: ({ row }) => (
      <span className='text-xs tabular-nums'>{row.getValue('usedDays')}</span>
    ),
  },
  {
    accessorKey: 'carryOverDays',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Carry Over' />
    ),
    cell: ({ row }) => (
      <span className='text-xs tabular-nums'>
        {row.getValue('carryOverDays')}
      </span>
    ),
  },
  {
    accessorKey: 'remainingDays',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Remaining' />
    ),
    cell: ({ row }) => {
      const remaining = row.getValue('remainingDays') as number
      return (
        <Badge
          variant='outline'
          className={cn(
            'text-[11px] tabular-nums',
            remaining > 0
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-muted-foreground/30 bg-muted text-muted-foreground'
          )}
        >
          {remaining}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions row={row.original} />,
  },
]

function RowActions({ row }: { row: LeaveBalance }) {
  const { setOpen, setCurrentRow } = useLeaveBalances()
  return (
    <div className='flex items-center justify-end gap-1'>
      <Button
        variant='ghost'
        size='icon'
        className='h-7 w-7'
        onClick={() => {
          setCurrentRow(row)
          setOpen('edit')
        }}
      >
        <Pencil size={14} />
        <span className='sr-only'>Edit</span>
      </Button>
    </div>
  )
}
