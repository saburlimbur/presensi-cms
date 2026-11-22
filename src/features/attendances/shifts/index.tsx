import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationDropdown } from '@/components/notification-dropdown'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ShiftsDialogs } from './components/shifts-dialogs'
import { ShiftsProvider } from './components/shifts-provider'
import { ShiftsTable } from './components/shifts-table'
import useGetShifts from './hooks/use-get-shifts'

function Shifts() {
  const { shifts, isLoading } = useGetShifts()

  return (
    <ShiftsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Shifts</h2>
            <p className='text-muted-foreground'>
              Manage working schedules and tolerance for employees.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded-md' />
            ))}
          </div>
        ) : (
          <ShiftsTable data={shifts} />
        )}
      </Main>

      <ShiftsDialogs />
    </ShiftsProvider>
  )
}

export default Shifts
