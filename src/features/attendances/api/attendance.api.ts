import ApiService from '@/lib/axios'

export const attendancesApi = {
  getAllUserAttendance: async (params?: Record<string, any>) => {
    const response = await ApiService.get('/attendance/list-user-attendances', {
      params,
    })
    return response.data
  },

  getUserAttendanceToday: async () => {
    const response = await ApiService.get('/attendance/today')
    return response.data
  },

  getAllUserAttendanceToExcel: async (params?: Record<string, any>) => {
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
}
