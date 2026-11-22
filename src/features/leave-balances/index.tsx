import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationDropdown } from '@/components/notification-dropdown'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LeaveBalancesDialogs } from './components/leave-balances-dialogs'
import { LeaveBalancesProvider } from './components/leave-balances-provider'
import { LeaveBalancesTable } from './components/leave-balances-table'
import useGetLeaveBalances from './hooks/use-get-leave-balances'

function LeaveBalances() {
  const { leaveBalances, isLoading } = useGetLeaveBalances()

  return (
    <LeaveBalancesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>
              Leave Balances
            </h2>
            <p className='text-muted-foreground'>
              Manage annual leave quota per employee.
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
          <LeaveBalancesTable data={leaveBalances} />
        )}
      </Main>

      <LeaveBalancesDialogs />
    </LeaveBalancesProvider>
  )
}

export default LeaveBalances
