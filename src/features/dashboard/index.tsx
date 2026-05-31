import { CheckCircle, Clock, UserMinus, XCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationDropdown } from '@/components/notification-dropdown'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import useGetEmployee from '../employees/hooks/use-get-employee'
import { ReportsChart } from '../reports/components/reports-chart'
import { MONTHS } from '../reports/components/reports-filter'
import { useMonthlyReports } from '../reports/hooks/use-monthly-report'
import { RecentAttendance } from './components/recent-attendance'

export function Dashboard() {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { employees, isLoading: isLoadingEmployee } = useGetEmployee()
  const monthlyReports = useMonthlyReports({ month, year })

  const summary = monthlyReports.data?.data?.summary
  const period = monthlyReports.data?.data?.period
  const isLoadingMonthly = monthlyReports.isLoading
  const monthLabel = MONTHS.find((m) => m.value === month)?.label ?? ''

  const totalEmployees = employees?.pagination?.total ?? 0

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>

        {/* Summary cards — pakai data monthly endpoint (akurat bulan berjalan) */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Karyawan
              </CardTitle>
              <UserMinus className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoadingEmployee ? (
                  <Skeleton className='h-7 w-12' />
                ) : (
                  totalEmployees
                )}
              </div>
              <p className='text-xs text-muted-foreground'>Karyawan aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Hadir Bulan Ini
              </CardTitle>
              <CheckCircle className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoadingMonthly ? (
                  <Skeleton className='h-7 w-12' />
                ) : (
                  (summary?.totalPresent ?? 0)
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                Total status PRESENT
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Telat Bulan Ini
              </CardTitle>
              <Clock className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoadingMonthly ? (
                  <Skeleton className='h-7 w-12' />
                ) : (
                  (summary?.totalLate ?? 0)
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                Total status LATE
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Absen Bulan Ini
              </CardTitle>
              <XCircle className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {isLoadingMonthly ? (
                  <Skeleton className='h-7 w-12' />
                ) : (
                  (summary?.totalAbsent ?? 0)
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                Total status ABSENT
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart + Recent Attendance */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='col-span-1 lg:col-span-4'>
            <CardHeader>
              <CardTitle>
                Status Kehadiran {monthLabel} {year}
              </CardTitle>
              {period && summary && (
                <CardDescription>
                  {period.workDays} hari kerja · {summary.totalEmployees}{' '}
                  karyawan
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className='px-2 sm:px-4'>
              <ReportsChart
                summary={summary}
                isLoading={isLoadingMonthly}
                height={300}
              />
            </CardContent>
          </Card>

          <Card className='col-span-1 lg:col-span-3'>
            <CardHeader className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <CardTitle>Recent Attendance</CardTitle>
                  <CardDescription>
                    Latest check-ins & check-outs from employees.
                  </CardDescription>
                </div>

                {/* Legend */}
                <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                  <div className='flex items-center gap-1.5'>
                    <span className='h-2.5 w-2.5 rounded-full bg-green-500' />
                    <span className='text-[10px]'>Check-in</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span className='h-2.5 w-2.5 rounded-full bg-red-500' />
                    <span className='text-[10px]'>Check-out</span>
                  </div>
                </div>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <RecentAttendance />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
