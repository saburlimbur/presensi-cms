import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { attendancesApi } from '../api/attendance.api'

export type AttendanceRecordsParams = {
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

export function useAttendanceRecords(params: AttendanceRecordsParams) {
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
