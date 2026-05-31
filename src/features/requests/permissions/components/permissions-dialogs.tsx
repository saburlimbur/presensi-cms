import { PermissionApproveDialog } from './permission-approve-dialog'
import { PermissionDetailDialog } from './permission-detail-dialog'
import { PermissionRejectDialog } from './permission-reject-dialog'
import { usePermissions } from './permissions-provider'

export function PermissionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePermissions()
  if (!currentRow) return null
  return (
    <>
      <PermissionDetailDialog
        key={`permission-detail-${currentRow.id}`}
        open={open === 'detail'}
        onOpenChange={() => {
          setOpen('detail')
          setTimeout(() => setCurrentRow(null), 500)
        }}
        currentRow={currentRow}
      />

      <PermissionApproveDialog
        key={`permission-approve-${currentRow.id}`}
        open={open === 'approve'}
        onOpenChange={() => {
          setOpen('approve')
        }}
        currentRow={currentRow}
      />

      <PermissionRejectDialog
        key={`permission-reject-${currentRow.id}`}
        open={open === 'reject'}
        onOpenChange={() => {
          setOpen('reject')
        }}
        currentRow={currentRow}
      />
    </>
  )
}
