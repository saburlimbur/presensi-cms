import { useQuery } from '@tanstack/react-query'
import { attendancesApi } from '../api/attendance.api'

export function useUserAttendanceToday() {
  const { data, isLoading } = useQuery({
    queryKey: ['userAttendanceToday'],
    queryFn: async () => {
      return await attendancesApi.getUserAttendanceToday()
    },
  })

  return { userAttendanceToday: data, isLoading }
}
