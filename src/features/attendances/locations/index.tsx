import { useState } from 'react'
import {
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserMinus,
  Monitor,
  Fingerprint,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { MapRouteDistance } from './components/map-route'

const DUMMY_USERS = [
  {
    id: '1',
    fullName: 'Super Admin',
    employeeId: 'ADM-001',
    position: 'DIRECTOR',
    department: { name: 'Executive', code: 'EXEC' },
    isActive: true,
    isFaceRegistered: true,
    locationName: 'Head Office - Jakarta',
    progress: 100,
    status: 'PRESENT', // AttendanceStatus Enum
    shift: 'MORNING', // ShiftName Enum
    device: 'iPhone 15 Pro',
    method: 'FACE_RECOGNITION',
  },
  {
    id: '2',
    fullName: 'Tony Ware',
    employeeId: 'EMP-042',
    position: 'IT_SPECIALIST',
    department: { name: 'Information Technology', code: 'IT' },
    isActive: true,
    isFaceRegistered: true,
    locationName: 'On the way to Client A',
    progress: 76,
    status: 'WORK_FROM_HOME',
    shift: 'FLEXIBLE',
    device: 'MacBook Pro',
    method: 'MOBILE_APP',
  },
  {
    id: '3',
    fullName: 'Paige Gould',
    employeeId: 'EMP-015',
    position: 'MANAGER',
    department: { name: 'Operations', code: 'OPS' },
    isActive: true,
    isFaceRegistered: false,
    locationName: 'Project Site B - Bekasi',
    progress: 45,
    status: 'LATE',
    shift: 'MORNING',
    device: 'Samsung S24',
    method: 'QR_CODE',
  },
]

function Locations() {
  const [selectedUser, setSelectedUser] = useState(DUMMY_USERS[0])

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
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
          <div className='flex w-full flex-shrink-0 flex-col gap-4 pr-0 lg:w-96 lg:overflow-y-auto lg:pr-2'>
            <Card className='relative overflow-hidden border-1 border-gray-200 p-5 shadow-sm'>
              {/*<div className='absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl' />*/}

              <div className='relative flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                  <span className='text-[10px] font-bold tracking-wider text-muted-foreground uppercase'>
                    Live Tracking
                  </span>
                </div>
                <div className='flex items-center gap-1 text-[10px] font-bold text-primary'>
                  <Monitor size={12} />
                  {selectedUser.device}
                </div>
              </div>

              <div className='relative flex items-center gap-4'>
                <Avatar className='h-14 w-14 border-2 border-primary/20'>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.fullName}`}
                  />
                  <AvatarFallback>
                    {selectedUser.fullName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='text-lg leading-none font-bold'>
                    {selectedUser.fullName}
                  </h2>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {selectedUser.position.replace('_', ' ')} •{' '}
                    {selectedUser.employeeId}
                  </p>
                </div>
              </div>

              <Separator className='opacity-50' />

              {/* Info Grid: Shift & Status */}
              <div className='my-3 grid grid-cols-2 gap-3'>
                <div className='rounded-lg border border-border/50 bg-muted/50 p-2'>
                  <p className='text-[9px] font-bold text-muted-foreground uppercase'>
                    Status
                  </p>
                  <p className='text-xs font-bold text-foreground'>
                    {selectedUser.status.replace('_', ' ')}
                  </p>
                </div>
                <div className='rounded-lg border border-border/50 bg-muted/50 p-2'>
                  <p className='text-[9px] font-bold text-muted-foreground uppercase'>
                    Shift
                  </p>
                  <p className='text-xs font-bold text-foreground'>
                    {selectedUser.shift}
                  </p>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='flex items-center gap-1.5 text-muted-foreground'>
                    <MapPin size={14} className='text-primary' /> Location
                  </span>
                  <span className='max-w-[150px] truncate font-bold'>
                    {selectedUser.locationName}
                  </span>
                </div>
                <div className='flex items-center justify-between text-xs'>
                  <span className='flex items-center gap-1.5 text-muted-foreground'>
                    <Fingerprint size={14} className='text-primary' /> Method
                  </span>
                  <span className='font-bold'>
                    {selectedUser.method.replace('_', ' ')}
                  </span>
                </div>
                {/*<div className='space-y-1.5'>
                  <div className='flex justify-between text-[10px] font-bold uppercase'>
                    <span>Journey Progress</span>
                    <span>{selectedUser.progress}%</span>
                  </div>
                  <Progress value={selectedUser.progress} className='h-1.5' />
                </div>*/}
              </div>

              <div className='mt-2 flex gap-2'>
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
                  {DUMMY_USERS.length} Total
                </span>
              </div>

              <div className='flex flex-col gap-2.5'>
                {DUMMY_USERS.map((user) => {
                  const isActive = selectedUser.id === user.id
                  return (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={cn(
                        'group relative cursor-pointer rounded-xl border p-3 transition-all duration-300',
                        isActive
                          ? 'border-gray-200 bg-gray-100 shadow-sm'
                          : 'bg-card hover:border-primary/30 hover:bg-muted/50'
                      )}
                    >
                      {/* Badge Status kecil di pojok kanan atas */}
                      <div className='absolute top-2 right-2'>
                        <span
                          className={cn(
                            'rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase',
                            user.status === 'PRESENT'
                              ? 'border-green-200 bg-green-50 text-green-600'
                              : user.status === 'LATE'
                                ? 'border-orange-200 bg-orange-50 text-orange-600'
                                : 'border-blue-200 bg-blue-50 text-blue-600'
                          )}
                        >
                          {user.status.charAt(0)}
                        </span>
                      </div>

                      <div className='flex items-center gap-3'>
                        <div className='relative'>
                          <Avatar className='h-10 w-10 border border-border'>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                            />
                            <AvatarFallback>
                              {user.fullName.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          {user.isFaceRegistered && (
                            <div className='absolute -right-1 -bottom-1 rounded-full bg-background p-0.5 shadow-sm'>
                              <ShieldCheck
                                size={12}
                                className='text-blue-500'
                              />
                            </div>
                          )}
                        </div>

                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center justify-between'>
                            <p className='truncate text-sm leading-none font-bold'>
                              {user.fullName}
                            </p>
                          </div>
                          <div className='mt-1.5 flex items-center gap-2'>
                            <span className='flex items-center gap-1 text-[10px] text-muted-foreground'>
                              <Clock size={10} /> {user.shift}
                            </span>
                            <span className='text-[10px] text-muted-foreground'>
                              •
                            </span>
                            <span className='text-[10px] font-medium text-primary'>
                              {user.department.code}
                            </span>
                          </div>
                        </div>

                        <div className='text-right'>
                          <p
                            className={cn(
                              'text-xs font-black',
                              isActive
                                ? 'text-primary'
                                : 'text-muted-foreground/50'
                            )}
                          >
                            {user.progress}%
                          </p>
                          <div className='mt-1 h-1 w-8 overflow-hidden rounded-full bg-muted'>
                            <div
                              className='h-full bg-primary transition-all duration-500'
                              style={{ width: `${user.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: MAP */}
          <div className='min-h-[450px] flex-1 overflow-hidden rounded-2xl border border-border bg-muted/10 shadow-inner lg:min-h-0'>
            <MapRouteDistance />
          </div>
        </div>
      </Main>
    </>
  )
}

export default Locations
