import { CheckCircle, Clock, FileText, UserMinus } from 'lucide-react'
import ApiService from '@/lib/axios'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { NotificationDropdown } from '@/components/notification-dropdown'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAllUserAttendance } from '../attendances/hooks/use-all-user-attendance'
import useGetEmployee from '../employees/hooks/use-get-employee'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentAttendance } from './components/recent-attendance'

export function Dashboard() {
  const { employees, isLoading: isLoadingEmployee } = useGetEmployee()
  const { allUserAttendance, isLoading: isLoadingAttendance } =
    useAllUserAttendance()

  const totalEmployeeData = employees?.pagination?.total || 0

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Employees
                  </CardTitle>
                  <UserMinus className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoadingEmployee ? (
                      <Skeleton className='h-7 w-12 pb-2' />
                    ) : (
                      totalEmployeeData
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Active staff members
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Present Today
                  </CardTitle>
                  <CheckCircle className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isLoadingAttendance ? (
                      <Skeleton className='h-7 w-12 pb-2' />
                    ) : (
                      allUserAttendance?.pagination?.total
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Recorded attendances today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Late Arrivals
                  </CardTitle>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>12</div>
                  <p className='text-xs text-muted-foreground'>
                    Requires attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Pending Requests
                  </CardTitle>
                  <FileText className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>8</div>
                  <p className='text-xs text-muted-foreground'>
                    Permissions & Overtime
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Attendance Trends</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview />{' '}
                  {/* Pastikan Overview.tsx menampilkan Chart Kehadiran */}
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Attendance</CardTitle>
                  <CardDescription>
                    Latest check-ins from employees.
                  </CardDescription>
                  <Separator />
                </CardHeader>
                <CardContent>
                  <RecentAttendance />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: '/',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Detailed Analytics',
    href: '/dashboard/analytics',
    isActive: false,
    disabled: true,
  },
  {
    title: 'System Logs',
    href: '/dashboard/audit',
    isActive: false,
    disabled: true,
  },
]
