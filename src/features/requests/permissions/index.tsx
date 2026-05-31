import { useMemo, useState } from 'react'
import { RefreshCw, Search as SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationDropdown } from '@/components/notification-dropdown'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PermissionsDialogs } from './components/permissions-dialogs'
import { PermissionsProvider } from './components/permissions-provider'
import { PermissionsTable } from './components/permissions-table'
import { PERMISSION_TYPE_OPTIONS } from './data/schema'
import useGetPermissions from './hooks/use-get-permissions'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

function Permissions() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')

  const params = useMemo(
    () => ({
      ...(status !== 'all' ? { status } : {}),
      ...(type !== 'all' ? { type } : {}),
    }),
    [status, type]
  )

  const { permissions, isLoading, isFetching, refetch } = useGetPermissions(params)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return permissions
    return permissions.filter((p: any) => {
      const name = p.user?.fullName?.toLowerCase() ?? ''
      const empId = p.user?.employeeId?.toLowerCase() ?? ''
      return name.includes(q) || empId.includes(q)
    })
  }, [permissions, search])

  return (
    <PermissionsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              Permission Requests
            </h1>
            <p className='text-sm text-muted-foreground'>
              Review, approve, or reject employee leave & permission requests.
            </p>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => refetch()}
            disabled={isFetching}
            className='gap-2'
          >
            <RefreshCw size={14} className={cn(isFetching && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        <Card className='p-4'>
          <div className='flex flex-wrap items-center gap-3'>
            <div className='relative min-w-[220px] flex-1'>
              <SearchIcon
                size={14}
                className='absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'
              />
              <Input
                placeholder='Search by name or employee ID...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-9'
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                {PERMISSION_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded-md' />
            ))}
          </div>
        ) : (
          <PermissionsTable data={filtered} />
        )}
      </Main>

      <PermissionsDialogs />
    </PermissionsProvider>
  )
}

export default Permissions
