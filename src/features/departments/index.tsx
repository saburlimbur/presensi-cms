import { useMemo, useState } from 'react'
import {
  Building2,
  LayoutGrid,
  Pencil,
  Plus,
  Search as SearchIcon,
  Trash2,
  User,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationDropdown } from '@/components/notification-dropdown'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DepartmentEmployeesTable } from './components/department-employees-table'
import { type Department } from './components/departments-columns'
import { DepartmentsDialogs } from './components/departments-dialogs'
import {
  DepartmentsProvider,
  useDepartments,
} from './components/departments-provider'
import useGetAllDepartments from './hooks/useGetAllDepartments'

function Departments() {
  return (
    <DepartmentsProvider>
      <DepartmentsContent />
      <DepartmentsDialogs />
    </DepartmentsProvider>
  )
}

function DepartmentsContent() {
  const { data: departments, isLoading } = useGetAllDepartments()
  const { setOpen, setCurrentRow } = useDepartments()
  const [selectedId, setSelectedId] = useState<string>('all')
  const [search, setSearch] = useState('')

  // Daftar departemen sudah diambil semua (limit 100), jadi pencarian
  // nama/kode cukup di browser dan kartu ringkasan tetap menghitung total.
  const visibleDepartments = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return departments ?? []
    return (departments ?? []).filter(
      (d: Department) =>
        d.name.toLowerCase().includes(keyword) ||
        d.code.toLowerCase().includes(keyword)
    )
  }, [departments, search])

  const totalEmployees =
    departments?.reduce(
      (sum: number, dept: Department) => sum + dept._count.employees,
      0
    ) ?? 0

  const isAll = selectedId === 'all'

  const selectedDepartment = useMemo(
    () =>
      isAll
        ? null
        : (departments?.find((d: Department) => d.id === selectedId) ?? null),
    [departments, selectedId, isAll]
  )

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Departments</h2>
            <p className='text-muted-foreground'>
              Manage departments in your organization.
            </p>
          </div>
          <Button
            onClick={() => {
              setCurrentRow(null)
              setOpen('add')
            }}
          >
            <Plus className='h-4 w-4' /> Add Department
          </Button>
        </div>

        {/* Summary Cards (Total Stats) */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Departments
              </CardTitle>
              <Building2 className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoading ? (
                  <Skeleton className='h-8 w-12' />
                ) : (
                  (departments?.length ?? 0)
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Employees
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoading ? <Skeleton className='h-8 w-12' /> : totalEmployees}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>
                With Head Assigned
              </CardTitle>
              <User className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoading ? (
                  <Skeleton className='h-8 w-12' />
                ) : (
                  (departments?.filter((d: Department) => d.head !== null)
                    .length ?? 0)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* selectable department cards */}
        <div>
          <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
            <h3 className='text-sm font-medium text-muted-foreground'>
              Select a department to view employees
            </h3>
            <div className='relative w-full sm:w-64'>
              <SearchIcon className='absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Cari nama atau kode...'
                className='h-9 ps-8'
              />
            </div>
          </div>
          {isLoading ? (
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className='h-25 w-full rounded-xl' />
              ))}
            </div>
          ) : (
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
              {/* all departments card */}
              <Card
                className={cn(
                  'cursor-pointer gap-3 py-3 transition-all hover:shadow-sm',
                  isAll && 'bg-primary/5'
                )}
                onClick={() => setSelectedId('all')}
              >
                <CardHeader className='pb-0'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                        isAll ? 'bg-primary text-primary-foreground' : ''
                      )}
                    >
                      <LayoutGrid className='h-4 w-4' />
                    </div>
                    <div className='flex w-full items-center justify-between'>
                      <CardTitle className='text-sm'>All Departments</CardTitle>
                      <Badge
                        variant='secondary'
                        className='mt-1 font-mono text-[10px]'
                      >
                        ALL
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='mt-3 pb-0'>
                  <div className='flex items-center justify-between text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1.5'>
                      <Building2 className='h-3.5 w-3.5' />
                      <span className='text-xs'>
                        {departments?.length ?? 0} departments
                      </span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <Users className='h-3.5 w-3.5' />
                      <span className='text-xs'>{totalEmployees}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Department Cards */}
              {visibleDepartments.map((dept: Department) => {
                const isSelected = selectedId === dept.id
                return (
                  <Card
                    key={dept.id}
                    className={cn(
                      'group relative cursor-pointer gap-3 py-3 transition-all hover:shadow-sm',
                      isSelected && 'bg-primary/5'
                    )}
                    onClick={() => setSelectedId(dept.id)}
                  >
                    <div className='absolute end-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6'
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentRow(dept)
                          setOpen('edit')
                        }}
                      >
                        <Pencil size={12} />
                        <span className='sr-only'>Edit</span>
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6 text-destructive hover:text-destructive'
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentRow(dept)
                          setOpen('delete')
                        }}
                      >
                        <Trash2 size={12} />
                        <span className='sr-only'>Delete</span>
                      </Button>
                    </div>
                    <CardHeader className='pb-0'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-primary/10 text-primary'
                          )}
                        >
                          {/* Icon tetap Building2, gausah ganti Check */}
                          <Building2 className='h-4 w-4' />
                        </div>
                        <div className='flex w-full items-center justify-between'>
                          <CardTitle className='text-sm'>{dept.name}</CardTitle>
                          <Badge
                            variant='secondary'
                            className='mt-1 font-mono text-[10px]'
                          >
                            {dept.code}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='mt-3 pb-0'>
                      <div className='flex items-center justify-between text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1.5'>
                          <User className='h-3.5 w-3.5' />
                          <span className='max-w-[80px] truncate text-xs'>
                            {dept.head?.fullName ?? 'No head'}
                          </span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                          <Users className='h-3.5 w-3.5' />
                          <span className='text-xs'>
                            {dept._count.employees}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {visibleDepartments.length === 0 && search.trim() !== '' && (
                <p className='col-span-full py-6 text-center text-sm text-muted-foreground'>
                  Tidak ada departemen yang cocok dengan "{search.trim()}".
                </p>
              )}
            </div>
          )}
        </div>

        {/* Employee Table */}
        <div className='mt-2'>
          <h3 className='mb-3 text-lg font-semibold'>Department Employees</h3>
          <DepartmentEmployeesTable
            selectedDepartmentId={isAll ? 'all' : selectedId}
            selectedDepartmentName={
              isAll ? 'All Departments' : (selectedDepartment?.name ?? '')
            }
            employeeCount={
              isAll
                ? totalEmployees
                : (selectedDepartment?._count.employees ?? 0)
            }
          />
        </div>
      </Main>
    </>
  )
}

export default Departments
