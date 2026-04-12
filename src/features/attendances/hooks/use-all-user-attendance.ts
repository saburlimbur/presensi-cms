import { useQuery } from '@tanstack/react-query'
import { attendancesApi } from '../api/attendance.api'

export function useAllUserAttendance() {
  const { data, isLoading } = useQuery({
    queryKey: [
      'allUserAttendance',
      {
        page: 1,
        limit: 5,
      },
    ],
    queryFn: async () => {
      return await attendancesApi.getAllUserAttendance({
        page: 1,
        limit: 5,
      })
    },
  })

  return { allUserAttendance: data, isLoading }
}
