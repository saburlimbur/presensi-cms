import ApiService from '@/lib/axios'

// field datetime dikirim sebagai iso string
export type ManualAttendancePayload = {
  userId: string
  date: string
  checkIn: string
  checkOut?: string
  status: string
  workMode: 'WFO' | 'WFA'
  shiftName?: string
  latitudeIn?: number
  longitudeIn?: number
  latitudeOut?: number
  longitudeOut?: number
  note?: string
}

export type Attendance = {
  id: string
  userId: string
  date: string
  checkIn: string | null
  checkOut: string | null
  status: string
  method: string
  workMode: 'WFO' | 'WFA'
  shiftName: string | null
  note: string | null
  latitudeIn: number | null
  longitudeIn: number | null
  latitudeOut: number | null
  longitudeOut: number | null
  isLocationValid: boolean | null
  deviceInfo: string | null
  user: {
    id: string
    fullName: string
    email: string
    employeeId: string
    position: string
    department: { id: string; name: string; code: string } | null
  }
}

export type AttendanceListParams = {
  page?: number
  limit?: number
  status?: string
  workMode?: string
  userId?: string
  departmentId?: string
  date?: string
  dateFrom?: string
  dateTo?: string
  shiftName?: string
}

export const attendancesApi = {
  getAllUserAttendance: async (params?: AttendanceListParams) => {
    const response = await ApiService.get<{
      data: Attendance[]
      pagination?: {
        total: number
        page: number
        limit: number
        totalPages: number
      }
    }>('/attendance/list-user-attendances', { params })
    return response.data
  },

  getUserAttendanceToday: async () => {
    const response = await ApiService.get('/attendance/today')
    return response.data
  },

  getAllUserAttendanceToExcel: async (params?: AttendanceListParams) => {
    const response = await ApiService.get(
      '/attendance/list-user-attendances/export',
      {
        params,
        responseType: 'blob',
      }
    )
    return response.data as Blob
  },

  getUserSummary: async () => {
    const response = await ApiService.get(
      '/attendance/user-summary-attendances'
    )
    return response.data
  },

  getUserAttendanceDetail: async (id: string) => {
    const response = await ApiService.get(`/attendance/user-attendance/${id}`)
    return response.data
  },

  createManual: async (payload: ManualAttendancePayload) => {
    const response = await ApiService.post('/attendance/create-manual', payload)
    return response.data
  },
}
