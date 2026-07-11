import { type ColumnDef } from '@tanstack/react-table'
import { MapPin, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Location } from '../data/schema'
import { useLocations } from './locations-provider'

export const locationsColumns: ColumnDef<Location>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const { name, address } = row.original
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='text-xs font-medium'>{name}</span>
          <span className='line-clamp-1 max-w-[260px] text-[11px] text-muted-foreground'>
            {address || '-'}
          </span>
        </div>
      )
    },
  },
  {
    id: 'coordinates',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Coordinates' />
    ),
    cell: ({ row }) => {
      const { latitude, longitude } = row.original
      return (
        <div className='inline-flex items-center gap-1.5 font-mono text-xs tabular-nums'>
          <MapPin size={12} className='text-muted-foreground' />
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'radius',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Radius' />
    ),
    cell: ({ row }) => (
      <span className='text-xs'>{row.getValue('radius')} m</span>
    ),
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

function RowActions({ row }: { row: Location }) {
  const { setOpen, setCurrentRow } = useLocations()
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
