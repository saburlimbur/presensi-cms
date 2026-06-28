import { useState, useEffect } from 'react'
import {
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Monitor,
  Fingerprint,
  Clock,
  UserX,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationDropdown } from '@/components/notification-dropdown'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAllUserAttendance } from '../hooks/use-all-user-attendance'
import { MapRouteDistance } from './components/map-route'

// Skeleton untuk kolom kiri (detail card + list) saat fetch berjalan.
function LocationsSidebarSkeleton() {
  return (
    <div className='space-y-4'>
      <Card className='p-5'>
        <div className='flex justify-between'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-20' />
        </div>
        <div className='mt-4 flex items-center gap-4'>
          <Skeleton className='h-14 w-14 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-3 w-24' />
          </div>
        </div>
        <Separator className='my-4' />
        <div className='grid grid-cols-2 gap-3'>
          <Skeleton className='h-12 w-full rounded-lg' />
          <Skeleton className='h-12 w-full rounded-lg' />
        </div>
        <div className='mt-4 space-y-3'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
        </div>
      </Card>
      <div className='space-y-2'>
        <Skeleton className='h-12 w-full rounded-xl' />
        <Skeleton className='h-12 w-full rounded-xl' />
        <Skeleton className='h-12 w-full rounded-xl' />
      </div>
    </div>
  )
}

// Empty state — tampil kalau fetch sukses tapi tidak ada karyawan yang
// sedang check-in aktif (semua sudah check-out atau belum ada absensi hari ini).
function LocationsEmptyState() {
  return (
    <Card className='flex flex-col items-center justify-center gap-3 p-10 text-center'>
      <div className='flex h-14 w-14 items-center justify-center rounded-full bg-muted'>
        <UserX className='h-7 w-7 text-muted-foreground' />
      </div>
      <div>
        <h3 className='text-sm font-semibold'>
          Belum ada karyawan aktif
        </h3>
        <p className='mt-1 text-xs text-muted-foreground'>
          Saat ini tidak ada karyawan yang sedang check-in. Tracking akan
          muncul setelah karyawan melakukan absensi masuk.
        </p>
      </div>
    </Card>
  )
}

// Placeholder map saat belum ada data aktif untuk dirender.
function LocationsMapPlaceholder({
  icon: Icon,
  message,
}: {
  icon: typeof UserX
  message: string
}) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground'>
      <Icon className='h-10 w-10' />
      <p className='text-sm'>{message}</p>
    </div>
  )
}

function Locations() {
  const { allUserAttendance, isLoading } = useAllUserAttendance()
  const attendanceData = (allUserAttendance?.data || []).filter(
    (item: any) => !item.checkOut
  )
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null)

  useEffect(() => {
    if (attendanceData.length > 0 && !selectedAttendance) {
      setSelectedAttendance(attendanceData[0])
    }
  }, [attendanceData, selectedAttendance])

  const activeRecord = selectedAttendance || attendanceData[0]

  // Tiga-state guard: (1) loading, (2) sukses tapi empty, (3) ada data.
  // Sebelumnya conditional `isLoading || !activeRecord` bikin skeleton
  // tetap tampil saat data kosong → user kira masih loading terus.
  const isEmpty = !isLoading && attendanceData.length === 0

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight'>User Locations</h1>
          <p className='text-sm text-muted-foreground'>
            Real-time tracking of employees based on latest attendance
            geofencing.
          </p>
        </div>
        <Separator className='my-4' />

        <div className='flex flex-col gap-4 lg:h-[calc(100vh-14rem)] lg:flex-row lg:overflow-hidden'>
          {/* Kiri: detail + list */}
          <div className='flex w-full flex-shrink-0 flex-col gap-4 pr-0 lg:w-96 lg:overflow-y-auto lg:pr-2'>
            {isLoading ? (
              <LocationsSidebarSkeleton />
            ) : isEmpty ? (
              <LocationsEmptyState />
            ) : activeRecord ? (
              <>
                <Card className='relative overflow-hidden border-1 border-border p-5 shadow-sm'>
                  <div className='relative flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                      <span className='text-[10px] font-bold tracking-wider text-muted-foreground uppercase'>
                        Live Tracking
                      </span>
                    </div>
                    <div className='flex items-center gap-1 text-[10px] font-bold text-primary'>
                      <Monitor size={12} />
                      {activeRecord.deviceInfo || 'Unknown Device'}
                    </div>
                  </div>

                  <div className='relative flex items-center gap-4'>
                    <Avatar className='h-14 w-14 border-2 border-primary/20'>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRecord.user.fullName}`}
                      />
                      <AvatarFallback>
                        {activeRecord.user.fullName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className='text-lg leading-none font-bold'>
                        {activeRecord.user.fullName}
                      </h2>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {activeRecord.user.position.replace('_', ' ')} •{' '}
                        {activeRecord.user.employeeId}
                      </p>
                    </div>
                  </div>

                  <Separator className='opacity-50' />

                  <div className='my-3 grid grid-cols-2 gap-3'>
                    <div className='rounded-lg border border-border/50 bg-muted/50 p-2'>
                      <p className='text-[9px] font-bold text-muted-foreground uppercase'>
                        Status
                      </p>
                      <p className='text-xs font-bold text-foreground'>
                        {activeRecord.status} ({activeRecord.workMode})
                      </p>
                    </div>
                    <div className='rounded-lg border border-border/50 bg-muted/50 p-2'>
                      <p className='text-[9px] font-bold text-muted-foreground uppercase'>
                        Shift
                      </p>
                      <p className='text-xs font-bold text-foreground'>
                        {activeRecord.shiftName || 'Regular'}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='flex items-center gap-1.5 text-muted-foreground'>
                        <MapPin size={14} className='text-primary' />{' '}
                        Coordinates
                      </span>
                      <span className='max-w-[150px] truncate font-bold'>
                        {activeRecord.latitudeIn != null &&
                        activeRecord.longitudeIn != null
                          ? `${activeRecord.latitudeIn.toFixed(4)}, ${activeRecord.longitudeIn.toFixed(4)}`
                          : 'N/A'}
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='flex items-center gap-1.5 text-muted-foreground'>
                        <Fingerprint size={14} className='text-primary' />{' '}
                        Method
                      </span>
                      <span className='font-bold uppercase'>
                        {activeRecord.method}
                      </span>
                    </div>
                  </div>

                  <div className='mt-4 flex gap-2'>
                    <Button className='flex-1 gap-2 text-xs' size='sm'>
                      <MessageCircle size={14} /> Message
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex-1 gap-2 text-xs'
                    >
                      <Phone size={14} /> Call
                    </Button>
                  </div>
                </Card>

                <div className='flex flex-col gap-3'>
                  <div className='flex items-center justify-between px-1'>
                    <p className='text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
                      Active Employees
                    </p>
                    <span className='rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary'>
                      {attendanceData.length} Total
                    </span>
                  </div>

                  <div className='flex flex-col gap-2.5'>
                    {attendanceData.map((item: any) => {
                      const isActive = activeRecord?.id === item.id
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedAttendance(item)}
                          className={cn(
                            'group relative cursor-pointer rounded-xl border p-3 transition-all duration-300',
                            isActive
                              ? 'border-border bg-accent shadow-sm'
                              : 'bg-card hover:border-primary/30 hover:bg-muted/50'
                          )}
                        >
                          <div className='absolute top-2 right-2'>
                            <span
                              className={cn(
                                'rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase',
                                item.workMode === 'WFO'
                                  ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                                  : 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              )}
                            >
                              {item.workMode}
                            </span>
                          </div>

                          <div className='flex items-center gap-3'>
                            <div className='relative'>
                              <Avatar className='h-10 w-10 border border-border'>
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user.fullName}`}
                                />
                                <AvatarFallback>
                                  {item.user.fullName.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              {item.isLocationValid && (
                                <div className='absolute -right-1 -bottom-1 rounded-full bg-background p-0.5 shadow-sm'>
                                  <ShieldCheck
                                    size={12}
                                    className='text-blue-500'
                                  />
                                </div>
                              )}
                            </div>

                            <div className='min-w-0 flex-1'>
                              <p className='truncate text-sm leading-none font-bold'>
                                {item.user.fullName}
                              </p>
                              <div className='mt-1.5 flex items-center gap-2'>
                                <span className='flex items-center gap-1 text-[10px] text-muted-foreground'>
                                  <Clock size={10} />{' '}
                                  {new Date(item.checkIn).toLocaleTimeString(
                                    [],
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </span>
                                <span className='text-[10px] text-muted-foreground'>
                                  •
                                </span>
                                <span className='text-[10px] font-medium text-primary'>
                                  {item.user.department.code}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Kanan: map */}
          <div className='min-h-112.5 flex-1 overflow-hidden rounded-2xl border border-border bg-muted/10 shadow-inner lg:min-h-0'>
            {isLoading ? (
              <Skeleton className='h-full w-full rounded-2xl' />
            ) : isEmpty ? (
              <LocationsMapPlaceholder
                icon={MapPin}
                message='Belum ada lokasi untuk ditampilkan'
              />
            ) : activeRecord &&
              activeRecord.latitudeIn != null &&
              activeRecord.longitudeIn != null ? (
              <MapRouteDistance
                lat={activeRecord.latitudeIn}
                lng={activeRecord.longitudeIn}
                userName={activeRecord.user.fullName}
                checkIn={activeRecord.checkIn}
                checkOut={activeRecord.checkOut}
                latOut={activeRecord.latitudeOut}
                lngOut={activeRecord.longitudeOut}
                workMode={activeRecord.workMode}
                note={activeRecord.note}
                key={activeRecord.id}
              />
            ) : activeRecord ? (
              <LocationsMapPlaceholder
                icon={MapPin}
                message='Karyawan ini tidak memiliki data koordinat GPS'
              />
            ) : null}
          </div>
        </div>
      </Main>
    </>
  )
}

export default Locations
