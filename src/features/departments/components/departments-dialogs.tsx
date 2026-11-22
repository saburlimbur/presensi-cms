import { DepartmentDeleteDialog } from './department-delete-dialog'
import { DepartmentFormDialog } from './department-form-dialog'
import { useDepartments } from './departments-provider'

export function DepartmentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDepartments()
  return (
    <>
      <DepartmentFormDialog
        key='department-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <DepartmentFormDialog
            key={`department-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <DepartmentDeleteDialog
            key={`department-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
