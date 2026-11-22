import { AxiosError } from 'axios'
import { toast } from 'sonner'

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message ?? fallback
  }
  return error instanceof Error ? error.message : fallback
}

export function handleServerError(error: unknown) {
  toast.error(getErrorMessage(error, 'Something went wrong!'))
}
