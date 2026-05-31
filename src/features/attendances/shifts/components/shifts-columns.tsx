import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Clock, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/data-table'
import { SHIFT_NAME_OPTIONS, type Shift } from '../data/schema'
import { useShifts } from './shifts-provider'

const NAME_LABEL = Object.fromEntries(
  SHIFT_NAME_OPTIONS.map((o) => [o.value, o.label])
)

function formatTime(iso: string) {
  try {
    return format(new Date(iso), 'HH:mm')
  } catch {
    return iso
  }
}

export const shiftsColumns: ColumnDef<Shift>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Shift Name' />
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='text-xs font-medium'>
            {NAME_LABEL[name] ?? name}
          </span>
          <span className='font-mono text-[10px] text-muted-foreground'>
            {name}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: 'time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Working Hours' />
    ),
    cell: ({ row }) => {
      const { startTime, endTime } = row.original
      return (
        <div className='inline-flex items-center gap-1.5 text-xs font-mono tabular-nums'>
          <Clock size={12} className='text-muted-foreground' />
          {formatTime(startTime)} – {formatTime(endTime)}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'gracePeriod',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Grace Period' />
    ),
    cell: ({ row }) => (
      <span className='text-xs'>{row.getValue('gracePeriod')} min</span>
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const desc = row.getValue('description') as string | null
      return (
        <span className='line-clamp-1 max-w-[280px] text-xs text-muted-foreground'>
          {desc || '-'}
        </span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return (
        <Badge
          variant='outline'
          className={cn(
            'text-[11px] capitalize',
            isActive
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-muted-foreground/30 bg-muted text-muted-foreground'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    filterFn: (row, _id, value) => {
      const isActive = row.original.isActive
      if (value.includes('active') && isActive) return true
      if (value.includes('inactive') && !isActive) return true
      return false
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions row={row.original} />,
  },
]

function RowActions({ row }: { row: Shift }) {
  const { setOpen, setCurrentRow } = useShifts()
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
      <Button
        variant='ghost'
        size='icon'
        className='h-7 w-7 text-destructive hover:text-destructive'
        onClick={() => {
          setCurrentRow(row)
          setOpen('delete')
        }}
      >
        <Trash2 size={14} />
        <span className='sr-only'>Delete</span>
      </Button>
    </div>
  )
}
