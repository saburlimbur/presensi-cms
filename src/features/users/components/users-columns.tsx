import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { statusTypes, roles, positions } from '../data/data'
import { type User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const usersColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'employeeId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Employee ID' />
    ),
    cell: ({ row }) => (
      <span className='text-xs font-medium'>{row.getValue('employeeId')}</span>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const fullName = row.getValue('fullName') as string
      const email = row.original.email
      const initials = fullName
        ?.split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

      return (
        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold'>
            {initials}
          </div>

          <div className='flex flex-col gap-1'>
            <span className='text-xs leading-none font-medium'>{fullName}</span>
            <span className='text-[11px] text-muted-foreground'>{email}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: 'department',
    accessorFn: (row) => row.department?.name ?? '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Department' />
    ),
    cell: ({ row }) => {
      const dept = row.original.department
      return <div className='text-xs'>{dept?.name ?? '-'}</div>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  {
    accessorKey: 'position',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Job Title' />
    ),
    cell: ({ row }) => {
      const pos = positions.find(
        ({ value }) => value === row.getValue('position')
      )
      return (
        <div className='flex items-center gap-x-2'>
          {pos?.icon && (
            <pos.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-xs'>
            {pos?.label ?? row.getValue('position')}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Employee Type' />
    ),
    cell: ({ row }) => {
      const userRole = roles.find(({ value }) => value === row.getValue('role'))
      return (
        <div className='flex items-center gap-x-2'>
          {userRole?.icon && (
            <userRole.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-xs'>
            {userRole?.label ?? row.getValue('role')}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      const status = isActive ? 'active' : 'inactive'
      const badgeColor = statusTypes.get(status)
      return (
        <Badge
          variant='outline'
          className={cn('text-xs capitalize', badgeColor)}
        >
          {status}
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
  // {
  //   accessorKey: 'isFaceRegistered',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Face' />
  //   ),
  //   cell: ({ row }) => {
  //     const registered = row.getValue('isFaceRegistered') as boolean
  //     return (
  //       <Badge
  //         variant={registered ? 'default' : 'secondary'}
  //         className='text-xs'
  //       >
  //         {registered ? 'Registered' : 'Not Yet'}
  //       </Badge>
  //     )
  //   },
  //   enableSorting: false,
  // },
  {
    accessorKey: 'joinDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Join Date' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('joinDate') as Date | null
      return (
        <div className='text-xs'>
          {date ? format(date, 'dd MMM yyyy') : '-'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
