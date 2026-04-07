import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersProvider } from '../users/components/users-provider'
import { UsersTable } from '../users/components/users-table'
import useGetEmployee from './hooks/use-get-employee'

const route = getRouteApi('/_authenticated/employees/')

function Employees() {
  const search = route.useSearch() // params dari URL (page, limit, search, dll)
  const navigate = route.useNavigate()

  const { employees, isLoading } = useGetEmployee()

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <UsersProvider>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Employees</h2>
              <p className='text-muted-foreground'>
                Manage employees and their roles here.
              </p>
            </div>
          </div>
          <UsersTable
            data={employees?.data || []}
            search={search}
            navigate={navigate}
          />
        </Main>
      </UsersProvider>
    </>
  )
}

export default Employees
