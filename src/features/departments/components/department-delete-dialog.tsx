import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import useDeleteDepartment from '../hooks/use-delete-department'
import { type Department } from './departments-columns'

type DepartmentDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Department
}

export function DepartmentDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: DepartmentDeleteDialogProps) {
  const deleteDepartment = useDeleteDepartment()
  const employeeCount = currentRow._count?.employees ?? 0

  const handleDelete = () => {
    deleteDepartment.mutate(currentRow.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      // Server tidak menolak penghapusan departemen yang masih berisi karyawan
      // (FK-nya SET NULL, karyawan jadi tanpa departemen), jadi dicegah di sini.
      disabled={deleteDepartment.isPending || employeeCount > 0}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete Department
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete department{' '}
            <span className='font-bold'>{currentRow.name}</span> (
            {currentRow.code})? This cannot be undone.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              {employeeCount > 0
                ? `Departemen ini masih memiliki ${employeeCount} karyawan. Pindahkan karyawan ke departemen lain terlebih dahulu sebelum menghapus.`
                : 'Penghapusan departemen bersifat permanen.'}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteDepartment.isPending ? 'Deleting...' : 'Delete'}
      destructive
    />
  )
}
