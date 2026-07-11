'use client'

import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Location } from '../data/schema'
import useDeleteLocation from '../hooks/use-delete-location'

type LocationDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Location
}

export function LocationDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: LocationDeleteDialogProps) {
  const deleteLocation = useDeleteLocation()

  const handleDelete = () => {
    deleteLocation.mutate(currentRow.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteLocation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Location
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete location{' '}
            <span className='font-bold'>{currentRow.name}</span>? This cannot be
            undone.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Employees will no longer be able to check in from this location.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteLocation.isPending ? 'Deleting...' : 'Delete'}
      destructive
    />
  )
}
