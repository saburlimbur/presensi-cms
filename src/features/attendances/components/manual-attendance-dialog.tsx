import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { type ManualAttendancePayload } from '../api/attendance.api'
import {
  ATTENDANCE_STATUSES,
  manualAttendanceFormSchema,
  NO_SHIFT,
  SHIFT_NAMES,
  WORK_MODES,
  type ManualAttendanceFormValues,
} from '../data/manual-attendance-schema'
import { useCreateManualAttendance } from '../hooks/use-create-manual-attendance'

type ManualAttendanceDialogProps = {
  userId: string
  employeeName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULT_VALUES: ManualAttendanceFormValues = {
  date: '',
  checkIn: '',
  checkOut: '',
  status: 'PRESENT',
  workMode: 'WFO',
  shiftName: NO_SHIFT,
  note: '',
}

const statusItems = ATTENDANCE_STATUSES.map((s) => ({ label: s, value: s }))
const workModeItems = WORK_MODES.map((w) => ({ label: w, value: w }))
const shiftItems = [
  { label: '— Tanpa shift —', value: NO_SHIFT },
  ...SHIFT_NAMES.map((s) => ({ label: s, value: s })),
]

export function ManualAttendanceDialog({
  userId,
  employeeName,
  open,
  onOpenChange,
}: ManualAttendanceDialogProps) {
  const createManual = useCreateManualAttendance()

  const form = useForm<ManualAttendanceFormValues>({
    resolver: zodResolver(manualAttendanceFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) form.reset(DEFAULT_VALUES)
  }, [open, form])

  const onSubmit = (values: ManualAttendanceFormValues) => {
    const payload: ManualAttendancePayload = {
      userId,
      date: new Date(values.date).toISOString(),
      checkIn: new Date(values.checkIn).toISOString(),
      status: values.status,
      workMode: values.workMode,
      ...(values.checkOut
        ? { checkOut: new Date(values.checkOut).toISOString() }
        : {}),
      ...(values.shiftName && values.shiftName !== NO_SHIFT
        ? { shiftName: values.shiftName }
        : {}),
      ...(values.note ? { note: values.note } : {}),
    }

    createManual.mutate(payload, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Buat Absensi Manual</DialogTitle>
          <DialogDescription>
            Catat absensi untuk{' '}
            <span className='font-medium'>{employeeName ?? 'karyawan'}</span>{' '}
            secara manual (mis. lupa check-in, dinas luar).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='manual-attendance-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='max-h-[60vh] space-y-4 overflow-y-auto pr-1'
          >
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='checkIn'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Masuk</FormLabel>
                    <FormControl>
                      <Input type='datetime-local' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='checkOut'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Keluar (opsional)</FormLabel>
                    <FormControl>
                      <Input type='datetime-local' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <SelectDropdown
                      isControlled
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Pilih status'
                      items={statusItems}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='workMode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Mode</FormLabel>
                    <SelectDropdown
                      isControlled
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Pilih work mode'
                      items={workModeItems}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='shiftName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shift (opsional)</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Pilih shift'
                    items={shiftItems}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan (opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder='Alasan pencatatan manual...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type='submit'
            form='manual-attendance-form'
            disabled={createManual.isPending}
          >
            {createManual.isPending ? 'Menyimpan...' : 'Simpan Absensi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
