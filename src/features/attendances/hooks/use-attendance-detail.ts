import { useQuery } from '@tanstack/react-query'
import { attendancesApi } from '../api/attendance.api'

// Detail satu record absensi (GET /attendance/user-attendance/:id).
// Hanya fetch saat ada id (dialog terbuka).
export function useAttendanceDetail(id: string | null) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['attendanceDetail', id],
    queryFn: async () => {
      const res = await attendancesApi.getUserAttendanceDetail(id as string)
      return res?.data
    },
    enabled: !!id,
    staleTime: 30_000,
  })

  return { detail: data, isLoading, isError, refetch }
}
