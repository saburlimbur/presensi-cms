import { LocationFormDialog } from './location-form-dialog'
import { LocationDeleteDialog } from './location-delete-dialog'
import { useLocations } from './locations-provider'

export function LocationsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLocations()
  return (
    <>
      <LocationFormDialog
        key='location-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <LocationFormDialog
            key={`location-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <LocationDeleteDialog
            key={`location-delete-${currentRow.id}`}
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
