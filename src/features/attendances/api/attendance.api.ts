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
}
