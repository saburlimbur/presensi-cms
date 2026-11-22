'use client'

import { useState } from 'react'
import { Check, Copy, KeyRound } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { type User } from '../data/schema'
import useResetUserPassword from '../hooks/use-reset-user-password'

type ResetPasswordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

type ResetResult = {
  employeeId: string
  email: string
  token: string
  expiresAt: string
}

export function UsersResetPasswordDialog({
  open,
  onOpenChange,
  currentRow,
}: ResetPasswordDialogProps) {
  const resetPassword = useResetUserPassword()
  const [result, setResult] = useState<ResetResult | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    resetPassword.mutate(currentRow.id, {
      onSuccess: (data) => setResult(data),
    })
  }

  const handleClose = (next: boolean) => {
    onOpenChange(next)
    if (!next) {
      // Reset state agar dialog bersih saat dibuka lagi.
      setTimeout(() => {
        setResult(null)
        setCopied(false)
      }, 300)
    }
  }

  const copyToken = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard bisa gagal di konteks non-secure; abaikan.
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader className='text-start'>
          <AlertDialogTitle>
            <span className='inline-flex items-center gap-2'>
              <KeyRound size={18} className='text-primary' />
              Reset Password
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              {result ? (
                <span>
                  Token reset untuk{' '}
                  <span className='font-semibold text-foreground'>
                    {currentRow.fullName}
                  </span>{' '}
                  berhasil dibuat. Serahkan token ini ke karyawan agar mereka
                  mengatur password sendiri.
                </span>
              ) : (
                <span>
                  Buat token reset password untuk{' '}
                  <span className='font-semibold text-foreground'>
                    {currentRow.fullName}
                  </span>{' '}
                  ({currentRow.email})? Password lama tetap berlaku sampai
                  karyawan menyelesaikan reset.
                </span>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {result && (
          <div className='space-y-3 rounded-lg border bg-muted/40 p-3'>
            <div className='space-y-1'>
              <p className='text-[11px] font-semibold tracking-wide text-muted-foreground uppercase'>
                Reset Token
              </p>
              <div className='flex items-center gap-2'>
                <code className='min-w-0 flex-1 truncate rounded-md border bg-background px-2 py-1.5 font-mono text-xs'>
                  {result.token}
                </code>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 shrink-0'
                  onClick={copyToken}
                >
                  {copied ? (
                    <Check size={14} className='text-emerald-500' />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span className='sr-only'>Copy token</span>
                </Button>
              </div>
            </div>
            <p className='text-[11px] text-muted-foreground'>
              Berlaku sampai{' '}
              <span className='font-medium text-foreground'>
                {new Date(result.expiresAt).toLocaleString()}
              </span>
              .
            </p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={resetPassword.isPending}>
            {result ? 'Close' : 'Cancel'}
          </AlertDialogCancel>
          {!result && (
            <Button onClick={handleGenerate} disabled={resetPassword.isPending}>
              {resetPassword.isPending ? 'Generating...' : 'Generate Link'}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
