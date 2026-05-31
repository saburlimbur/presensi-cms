import { useQuery } from '@tanstack/react-query'
import { attendancesApi } from '../api/attendance.api'

export function useAllUserAttendance() {
  const { data, isLoading, isFetching } = useQuery({
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

    // Update realtime diandalkan ke SSE (attendance:checked_in/out meng-invalidate
    // query ini). Polling 30 detik cukup sebagai fallback saat koneksi SSE putus.
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,

    placeholderData: (prev) => prev,

    staleTime: 10_000,
  })

  return { allUserAttendance: data, isLoading, isFetching }
}
