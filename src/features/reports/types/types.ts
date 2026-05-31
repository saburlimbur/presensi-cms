// Bentuk response disesuaikan dengan `buildReport` di
// absensi-server/src/modules/reports/reports.service.js.
// `summary` & `details[]` sama untuk monthly/weekly/range; yang beda hanya `period`.

export interface AttendanceSummary {
  totalEmployees: number
  totalPresent: number
  totalLate: number
  totalAbsent: number
  totalPermit: number
  totalLeave: number
  totalWfh: number
}

export interface EmployeeAttendanceDetail {
  userId: string
  employeeId: string
  fullName: string
  position: string
  department: string | null
  present: number
  late: number
  absent: number
  permit: number
  leave: number
  wfh: number
  totalWorkHours: number
}

export interface MonthlyPeriod {
  month: number
  year: number
  workDays: number
}

export interface WeeklyPeriod {
  weekStart: string // ISO
  weekEnd: string // ISO inclusive untuk display
  workDays: number
}

export interface RangePeriod {
  from: string // ISO
  to: string // ISO
  workDays: number
}

export type AttendancePeriod = MonthlyPeriod | WeeklyPeriod | RangePeriod

export interface AttendanceRecapData<TPeriod extends AttendancePeriod = AttendancePeriod> {
  period: TPeriod
  summary: AttendanceSummary
  details: EmployeeAttendanceDetail[]
}

export interface AttendanceRecapResponse<TPeriod extends AttendancePeriod = AttendancePeriod> {
  success: boolean
  message: string
  data: AttendanceRecapData<TPeriod>
}

export type MonthlyAttendanceRecapResponse = AttendanceRecapResponse<MonthlyPeriod>
export type WeeklyAttendanceRecapResponse = AttendanceRecapResponse<WeeklyPeriod>
export type RangeAttendanceRecapResponse = AttendanceRecapResponse<RangePeriod>

// Re-export untuk backward-compat dgn import lama.
export type MonthlyAttendanceRecapData = AttendanceRecapData<MonthlyPeriod>

export type Granularity = 'monthly' | 'weekly' | 'range'
