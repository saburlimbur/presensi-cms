import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  attendancesApi,
  type ManualAttendancePayload,
} from '../api/attendance.api'

export function useCreateManualAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ManualAttendancePayload) =>
      attendancesApi.createManual(payload),
    onSuccess: () => {
      toast.success('Absensi manual berhasil dibuat')
      queryClient.invalidateQueries({ queryKey: ['attendanceRecords'] })
      queryClient.invalidateQueries({ queryKey: ['allUserAttendance'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Gagal membuat absensi manual'
      toast.error(msg)
    },
  })
}

export default useCreateManualAttendance
