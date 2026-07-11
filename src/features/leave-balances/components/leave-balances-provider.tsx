import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type LeaveBalance } from '../data/schema'

type LeaveBalancesDialogType = 'add' | 'edit'

type LeaveBalancesContextType = {
  open: LeaveBalancesDialogType | null
  setOpen: (str: LeaveBalancesDialogType | null) => void
  currentRow: LeaveBalance | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LeaveBalance | null>>
}

const LeaveBalancesContext =
  React.createContext<LeaveBalancesContextType | null>(null)

export function LeaveBalancesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<LeaveBalancesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LeaveBalance | null>(null)

  return (
    <LeaveBalancesContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </LeaveBalancesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLeaveBalances = () => {
  const ctx = React.useContext(LeaveBalancesContext)
  if (!ctx)
    throw new Error(
      'useLeaveBalances must be used within <LeaveBalancesProvider>'
    )
  return ctx
}
