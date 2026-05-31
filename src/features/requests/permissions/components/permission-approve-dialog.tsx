'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarDays, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
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
import { Textarea } from '@/components/ui/textarea'
import {
  approveFormSchema,
  type ApproveFormValues,
  type Permission,
} from '../data/schema'
import useApprovePermission from '../hooks/use-approve-permission'
import { PERMISSION_TYPE_LABEL } from './permission-status-badge'

const MAX_NOTE = 500

type PermissionApproveDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Permission
}

export function PermissionApproveDialog({
  open,
  onOpenChange,
  currentRow,
}: PermissionApproveDialogProps) {
  const approve = useApprovePermission()

  const form = useForm<ApproveFormValues>({
    resolver: zodResolver(approveFormSchema),
    defaultValues: { note: '' },
  })

  const noteValue = form.watch('note') ?? ''

  const initials = (currentRow.user?.fullName ?? '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const onSubmit = (values: ApproveFormValues) => {
    approve.mutate(
      { id: currentRow.id, note: values.note?.trim() || undefined },
      {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(s) => {
        if (!s) form.reset()
        onOpenChange(s)
      }}
    >
      <DialogContent className='sm:max-w-md gap-0 overflow-hidden p-0'>
        <div className='relative border-b bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent px-6 pt-6 pb-5'>
          <DialogHeader className='text-start'>
            <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30'>
              <CheckCircle2 className='size-5 text-emerald-600 dark:text-emerald-400' />
            </div>
            <DialogTitle className='text-base'>Approve Permission</DialogTitle>
            <DialogDescription className='text-xs'>
              Konfirmasi persetujuan. Note akan dikirim ke notifikasi karyawan.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='space-y-4 px-6 py-5'>
          <div className='rounded-lg border bg-muted/30'>
            <div className='flex items-center gap-3 p-3'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-[11px] font-semibold ring-1 ring-border'>
                {initials || '?'}
              </div>
              <div className='min-w-0 flex-1'>
                <div className='truncate text-sm font-medium'>
                  {currentRow.user?.fullName ?? '-'}
                </div>
                <div className='truncate text-[11px] text-muted-foreground'>
                  {currentRow.user?.employeeId ?? '-'} ·{' '}
                  {currentRow.user?.department?.code ?? '-'}
                </div>
              </div>
              <Badge
                variant='outline'
                className='shrink-0 text-[10px] font-medium'
              >
                {PERMISSION_TYPE_LABEL[currentRow.type] ?? currentRow.type}
              </Badge>
            </div>
            <div className='flex items-center gap-2 border-t px-3 py-2 text-[11px] text-muted-foreground'>
              <CalendarDays size={13} />
              <span className='font-medium text-foreground'>
                {format(currentRow.startDate, 'dd MMM')} →{' '}
                {format(currentRow.endDate, 'dd MMM yyyy')}
              </span>
            </div>
          </div>

          <Form {...form}>
            <form
              id='permission-approve-form'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel className='text-xs'>
                        Note{' '}
                        <span className='font-normal text-muted-foreground'>
                          (optional)
                        </span>
                      </FormLabel>
                      <span
                        className={cn(
                          'text-[10px] tabular-nums text-muted-foreground',
                          noteValue.length >= MAX_NOTE && 'text-amber-500'
                        )}
                      >
                        {noteValue.length}/{MAX_NOTE}
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={4}
                        maxLength={MAX_NOTE}
                        placeholder='Contoh: Disetujui. Selamat beristirahat dan lekas pulih.'
                        className='resize-none text-sm'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-[11px]' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className='gap-2 border-t bg-muted/30 px-6 py-3 sm:gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            size='sm'
            form='permission-approve-form'
            disabled={approve.isPending}
            className='bg-emerald-600 text-white hover:bg-emerald-600/90 dark:bg-emerald-500 dark:hover:bg-emerald-500/90'
          >
            {approve.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <CheckCircle2 className='size-4' />
            )}
            Approve Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
