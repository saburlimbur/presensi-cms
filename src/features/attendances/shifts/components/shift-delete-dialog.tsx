'use client'

import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Shift } from '../data/schema'
import useDeleteShift from '../hooks/use-delete-shift'

type ShiftDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Shift
}

export function ShiftDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ShiftDeleteDialogProps) {
  const deleteShift = useDeleteShift()

  const handleDelete = () => {
    deleteShift.mutate(currentRow.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteShift.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Shift
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete shift{' '}
            <span className='font-bold'>{currentRow.name}</span>? This cannot
            be undone.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Employees currently assigned to this shift may lose their schedule.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteShift.isPending ? 'Deleting...' : 'Delete'}
      destructive
    />
  )
}
