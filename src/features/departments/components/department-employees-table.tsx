import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DataTableColumnHeader,
  DataTablePagination,
} from '@/components/data-table'
import { employeeService } from '@/features/employees/api/employee.service'
import { type User } from '@/features/users/data/schema'

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'employeeId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Employee ID' />
    ),
    cell: ({ row }) => (
      <span className='text-xs font-medium'>{row.getValue('employeeId')}</span>
    ),
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
    enableSorting: false,
  },
  {
    accessorKey: 'position',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Position' />
    ),
    cell: ({ row }) => {
      const position = row.getValue('position') as string

      // title case format
      const formattedPosition = position
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return <span className='text-xs'>{formattedPosition}</span>
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
            'text-xs capitalize',
            isActive
              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'joinDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Join Date' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('joinDate') as Date | null
      return (
        <span className='text-xs'>
          {date ? format(date, 'dd MMM yyyy') : '-'}
        </span>
      )
    },
  },
]

type DepartmentEmployeesTableProps = {
  selectedDepartmentId: string | null
  selectedDepartmentName: string
  employeeCount: number
}

export function DepartmentEmployeesTable({
  selectedDepartmentId,
  selectedDepartmentName,
  employeeCount,
}: DepartmentEmployeesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const { data: employeesData, isLoading } = useQuery({
    queryKey: ['department-employees', selectedDepartmentId],
    queryFn: () =>
      employeeService.getAll(
        selectedDepartmentId === 'all'
          ? {}
          : { departmentId: selectedDepartmentId }
      ),
    enabled: !!selectedDepartmentId && employeeCount > 0,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })

  const tableData = useMemo(() => employeesData?.data ?? [], [employeesData])

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (!selectedDepartmentId) {
    return (
      <div className='flex h-32 items-center justify-center rounded-md border text-sm text-muted-foreground'>
        Select a department to view its employees.
      </div>
    )
  }

  if (employeeCount === 0) {
    return (
      <div className='flex h-32 items-center justify-center rounded-md border text-sm text-muted-foreground'>
        No employee in here.
      </div>
    )
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <Input
          placeholder='Search employees...'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='max-w-sm'
        />
        <p className='shrink-0 text-sm text-muted-foreground'>
          {selectedDepartmentName}
        </p>
      </div>
      {isLoading ? (
        <Skeleton className='h-[300px] w-full rounded-md' />
      ) : (
        <>
          <div className='overflow-hidden rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className='group/row'>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className='bg-background group-hover/row:bg-muted'
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className='group/row'>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className='bg-background text-xs group-hover/row:bg-muted'
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} className='mt-auto' />
        </>
      )}
    </div>
  )
}
