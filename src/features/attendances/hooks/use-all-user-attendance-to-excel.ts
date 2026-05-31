import { format } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import { attendancesApi } from '../api/attendance.api'

export function useAllUserAttendanceToExcel() {
  return useMutation({
    mutationFn: async (params?: Record<string, any>) => {
      const blob = await attendancesApi.getAllUserAttendanceToExcel(params)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `attendance-records-${format(new Date(), 'yyyy-MM-dd')}.xlsx` // naming file
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      return true
    },
  })
}
