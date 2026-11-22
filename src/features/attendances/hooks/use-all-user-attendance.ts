import { useQuery } from '@tanstack/react-query'
import { attendancesApi } from '../api/attendance.api'

// limit default 5 untuk daftar "recent" di dashboard. Live tracking butuh
// semua sesi yang masih berjalan, jadi memanggil dengan limit 100 (batas
// server) supaya karyawan di luar 5 record terbaru tidak hilang dari peta.
export function useAllUserAttendance(limit = 5) {
  const params = { page: 1, limit }
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['allUserAttendance', params],
    queryFn: async () => {
      return await attendancesApi.getAllUserAttendance(params)
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
