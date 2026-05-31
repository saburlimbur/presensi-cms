import ApiService from '@/lib/axios'
import type {
  MonthlyAttendanceRecapResponse,
  RangeAttendanceRecapResponse,
  WeeklyAttendanceRecapResponse,
} from '../types/types'

export interface MonthlyQuery {
  month: number
  year: number
  departmentId?: string
  userId?: string
}

export interface WeeklyQuery {
  weekStart: string // YYYY-MM-DD
  departmentId?: string
  userId?: string
}

export interface RangeQuery {
  from: string // YYYY-MM-DD
  to: string // YYYY-MM-DD
  departmentId?: string
  userId?: string
}

export const reportApiService = {
  getMonthly: async (params: MonthlyQuery) => {
    const res = await ApiService.get<MonthlyAttendanceRecapResponse>(
      '/reports/attendance/monthly',
      { params }
    )
    return res.data
  },

  getWeekly: async (params: WeeklyQuery) => {
    const res = await ApiService.get<WeeklyAttendanceRecapResponse>(
      '/reports/attendance/weekly',
      { params }
    )
    return res.data
  },

  getRange: async (params: RangeQuery) => {
    const res = await ApiService.get<RangeAttendanceRecapResponse>(
      '/reports/attendance/range',
      { params }
    )
    return res.data
  },

  // Backward-compat: alias lama yang masih dipakai komponen lain.
  getAll: async (params: MonthlyQuery) => {
    const res = await ApiService.get<MonthlyAttendanceRecapResponse>(
      '/reports/attendance/monthly',
      { params }
    )
    return res.data
  },
}
