import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  PERMISSION_TYPE_OPTIONS,
  type PermissionStatus,
  type PermissionType,
} from '../data/schema'

const STATUS_MAP: Record<
  PermissionStatus,
  { label: string; className: string; dot: string }
> = {
  PENDING: {
    label: 'Pending',
    className:
      'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  APPROVED: {
    label: 'Approved',
    className:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'Rejected',
    className:
      'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'border-muted-foreground/30 bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
}

export function PermissionStatusBadge({
  status,
}: {
  status: PermissionStatus
}) {
  const conf = STATUS_MAP[status]
  return (
    <Badge
      variant='outline'
      className={cn('gap-1.5 text-[11px] font-medium', conf.className)}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', conf.dot)} />
      {conf.label}
    </Badge>
  )
}

export const PERMISSION_TYPE_LABEL: Record<PermissionType, string> =
  Object.fromEntries(
    PERMISSION_TYPE_OPTIONS.map((o) => [o.value, o.label])
  ) as Record<PermissionType, string>
