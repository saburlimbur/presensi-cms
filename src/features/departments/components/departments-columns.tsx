import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'

export type Department = {
  id: string
  name: string
  code: string
  headId: string | null
  head: { id: string; fullName: string } | null
  _count: {
    employees: number
  }
  createdAt: string
  updatedAt: string
}

export const departmentsColumns: ColumnDef<Department>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Code' />
    ),
    cell: ({ row }) => (
      <span className='text-xs font-medium'>{row.getValue('code')}</span>
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <span className='text-xs'>{row.getValue('name')}</span>,
  },
  {
    id: 'head',
    accessorFn: (row) => row.head?.fullName ?? '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Head' />
    ),
    cell: ({ row }) => (
      <span className='text-xs'>{row.original.head?.fullName ?? '-'}</span>
    ),
    enableSorting: false,
  },
  {
    id: 'employees',
    accessorFn: (row) => row._count.employees,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Employees' />
    ),
    cell: ({ row }) => (
      <span className='text-xs'>{row.original._count.employees}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('createdAt') as string
      return (
        <span className='text-xs'>
          {value ? format(new Date(value), 'dd MMM yyyy') : '-'}
        </span>
      )
    },
  },
]
