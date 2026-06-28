'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteUser } from '../api/users.queries'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const deleteUser = useDeleteUser()

  const handleDelete = () => {
    if (value.trim() !== currentRow.employeeId) return

    deleteUser.mutate(currentRow.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={
        value.trim() !== currentRow.employeeId || deleteUser.isPending
      }
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Deactivate Employee
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to deactivate{' '}
            <span className='font-bold'>{currentRow.fullName}</span>?
            <br />
            The account with ID{' '}
            <span className='font-bold'>{currentRow.employeeId}</span> will be
            disabled (cannot log in), but its attendance history is kept. You
            can re-activate it later.
          </p>

          <Label className='my-2'>
            Employee ID:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter employee ID to confirm.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              The employee will lose access until re-activated.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteUser.isPending ? 'Deactivating...' : 'Deactivate'}
      destructive
    />
  )
}
