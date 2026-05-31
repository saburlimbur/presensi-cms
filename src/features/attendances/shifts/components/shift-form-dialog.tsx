'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  shiftFormSchema,
  SHIFT_NAME_OPTIONS,
  type Shift,
  type ShiftFormValues,
} from '../data/schema'
import useCreateShift from '../hooks/use-create-shift'
import useUpdateShift from '../hooks/use-update-shift'

type ShiftFormDialogProps = {
  currentRow?: Shift
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Backend expect ISO datetime; UI pakai input type="time" jadi kita perlu
// gabung tanggal hari ini + jam yang dipilih saat submit.
function timeToIso(time: string) {
  if (!time) return ''
  const today = format(new Date(), 'yyyy-MM-dd')
  return new Date(`${today}T${time}:00`).toISOString()
}

function isoToTime(iso: string) {
  if (!iso) return ''
  try {
    return format(new Date(iso), 'HH:mm')
  } catch {
    return ''
  }
}

export function ShiftFormDialog({
  currentRow,
  open,
  onOpenChange,
}: ShiftFormDialogProps) {
  const isEdit = !!currentRow
  const createShift = useCreateShift()
  const updateShift = useUpdateShift()

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      name: 'MORNING',
      startTime: '',
      endTime: '',
      gracePeriod: 0,
      description: '',
      isActive: false,
    },
  })

  useEffect(() => {
    if (open && currentRow) {
      form.reset({
        name: currentRow.name,
        startTime: isoToTime(currentRow.startTime),
        endTime: isoToTime(currentRow.endTime),
        gracePeriod: currentRow.gracePeriod,
        description: currentRow.description ?? '',
        isActive: currentRow.isActive,
      })
    } else if (open && !currentRow) {
      form.reset({
        name: 'MORNING',
        startTime: '',
        endTime: '',
        gracePeriod: 0,
        description: '',
        isActive: false,
      })
    }
  }, [open, currentRow, form])

  const isPending = createShift.isPending || updateShift.isPending

  const onSubmit = (values: ShiftFormValues) => {
    // Convert HH:mm ke ISO sebelum kirim ke backend.
    const payload: ShiftFormValues = {
      ...values,
      startTime: timeToIso(values.startTime),
      endTime: timeToIso(values.endTime),
    }

    if (isEdit && currentRow) {
      updateShift.mutate(
        { id: currentRow.id, payload },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createShift.mutate(payload, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit Shift' : 'Add New Shift'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update working hours and grace period for this shift.'
              : 'Define a new shift that can be assigned to employees.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='shift-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 max-h-[60vh] overflow-y-auto pr-1'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shift Name</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select shift'
                    items={SHIFT_NAME_OPTIONS}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='startTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type='time' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type='time' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='gracePeriod'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grace Period (minutes)</FormLabel>
                  <FormControl>
                    <Input type='number' min={0} max={180} {...field} />
                  </FormControl>
                  <FormDescription className='text-[11px]'>
                    Toleransi keterlambatan sebelum dianggap LATE.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder='Short note about this shift.'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                  <div className='space-y-0.5'>
                    <FormLabel>Active</FormLabel>
                    <FormDescription className='text-[11px]'>
                      Inactive shifts tidak bisa dipilih oleh karyawan.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='shift-form' disabled={isPending}>
            {isPending
              ? 'Saving...'
              : isEdit
                ? 'Save changes'
                : 'Create Shift'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
