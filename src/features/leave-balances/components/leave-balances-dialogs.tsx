import { LeaveBalanceFormDialog } from './leave-balance-form-dialog'
import { useLeaveBalances } from './leave-balances-provider'

export function LeaveBalancesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLeaveBalances()
  return (
    <>
      <LeaveBalanceFormDialog
        key='leave-balance-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <LeaveBalanceFormDialog
          key={`leave-balance-edit-${currentRow.id}`}
          open={open === 'edit'}
          onOpenChange={() => {
            setOpen('edit')
            setTimeout(() => setCurrentRow(null), 500)
          }}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
