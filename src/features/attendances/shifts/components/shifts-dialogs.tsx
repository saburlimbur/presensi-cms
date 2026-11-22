import { ShiftDeleteDialog } from './shift-delete-dialog'
import { ShiftFormDialog } from './shift-form-dialog'
import { useShifts } from './shifts-provider'

export function ShiftsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useShifts()
  return (
    <>
      <ShiftFormDialog
        key='shift-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <ShiftFormDialog
            key={`shift-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <ShiftDeleteDialog
            key={`shift-delete-${currentRow.id}`}
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
