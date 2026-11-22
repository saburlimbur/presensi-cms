import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/handle-server-error'
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
    onError: (err) =>
      toast.error(getErrorMessage(err, 'Gagal membuat absensi manual')),
  })
}

export default useCreateManualAttendance
