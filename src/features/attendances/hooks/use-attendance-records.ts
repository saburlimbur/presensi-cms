import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  attendancesApi,
  type AttendanceListParams,
} from '../api/attendance.api'

export function useAttendanceRecords(params: AttendanceListParams) {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['attendanceRecords', params],
    queryFn: async () => {
      return await attendancesApi.getAllUserAttendance(params)
    },
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })

  return {
    records: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    refetch,
  }
}
