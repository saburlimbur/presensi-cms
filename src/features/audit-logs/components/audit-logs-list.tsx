import { useState } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ScrollText,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AUDIT_ACTION_META, AUDIT_ACTIONS, type AuditLog } from '../data/schema'
import useGetAuditLogs from '../hooks/use-get-audit-logs'

const ACTION_OPTIONS = [
  { value: 'all', label: 'Semua Action' },
  ...Object.values(AUDIT_ACTIONS).map((value) => ({
    value,
    label: AUDIT_ACTION_META[value]?.label ?? value,
  })),
]

export function AuditLogsList() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [action, setAction] = useState('all')

  const params = {
    page,
    limit,
    ...(action !== 'all' ? { action } : {}),
  }

  const { data, isLoading, isFetching } = useGetAuditLogs(params)

  const items = data?.data ?? []
  const total = data?.pagination?.total ?? 0
  const totalPages = data?.pagination?.totalPages ?? 1

  return (
    <div className='flex flex-col gap-4'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <Select
            value={action}
            onValueChange={(v) => {
              setAction(v)
              setPage(1)
            }}
          >
            <SelectTrigger className='w-[220px]'>
              <SelectValue placeholder='Filter Action' />
            </SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          {isFetching && (
            <span className='flex items-center gap-1'>
              <Loader2 className='h-3 w-3 animate-spin' />
              memuat…
            </span>
          )}
          <span>
            {total} total log {action !== 'all' ? `(filtered)` : ''}
          </span>
        </div>
      </div>

      {/* Table */}
      <Card className='overflow-hidden p-0'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/40 hover:bg-muted/40'>
              <TableHead className='pl-4'>Waktu</TableHead>
              <TableHead>Aktor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className='pr-4'>Detail</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className='py-8 text-center'>
                  <Loader2 className='mx-auto h-4 w-4 animate-spin text-muted-foreground' />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='py-16 text-center'>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              items.map((log) => <LogRow key={log.id} log={log} />)
            )}
          </TableBody>
        </Table>

        <Separator />

        {/* Pagination footer */}
        <div className='flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-muted-foreground'>
          <div className='flex items-center gap-3'>
            <span>
              Showing{' '}
              <span className='font-semibold text-foreground'>
                {items.length}
              </span>{' '}
              of <span className='font-semibold text-foreground'>{total}</span>{' '}
              logs
            </span>

            <Select
              value={String(limit)}
              onValueChange={(v) => {
                setLimit(Number(v))
                setPage(1)
              }}
            >
              <SelectTrigger size='sm' className='h-7 w-[78px] text-xs'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <span>
              Page <span className='font-semibold text-foreground'>{page}</span>{' '}
              of {totalPages}
            </span>
            <Button
              variant='outline'
              size='icon'
              className='h-7 w-7'
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-7 w-7'
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function LogRow({ log }: { log: AuditLog }) {
  const date = new Date(log.createdAt)
  const meta = AUDIT_ACTION_META[log.action] ?? {
    label: log.action,
    color: 'bg-muted text-muted-foreground',
  }

  return (
    <TableRow>
      <TableCell className='pl-4 align-top'>
        <div className='flex flex-col gap-0.5 text-xs'>
          <span className='font-medium tabular-nums'>
            {format(date, 'dd MMM yyyy', { locale: id })}
          </span>
          <span className='text-muted-foreground tabular-nums'>
            {format(date, 'HH:mm:ss')}
          </span>
        </div>
      </TableCell>

      <TableCell className='align-top'>
        {log.user ? (
          <div className='flex flex-col gap-0.5'>
            <span className='text-xs font-medium'>{log.user.fullName}</span>
            <span className='text-[11px] text-muted-foreground'>
              {log.user.employeeId} · {log.user.role}
            </span>
          </div>
        ) : (
          <span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
            <ShieldCheck size={12} />
            System
          </span>
        )}
      </TableCell>

      <TableCell className='align-top'>
        <Badge
          variant='secondary'
          className={cn('font-mono text-[10px]', meta.color)}
        >
          {log.action}
        </Badge>
      </TableCell>

      <TableCell className='pr-4 align-top'>
        <span className='text-xs text-muted-foreground'>
          {log.details ?? '-'}
        </span>
      </TableCell>
    </TableRow>
  )
}

function EmptyState() {
  return (
    <div className='flex flex-col items-center gap-2 text-muted-foreground'>
      <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-muted'>
        <ScrollText className='h-6 w-6' />
      </div>
      <p className='text-sm'>Belum ada audit log untuk filter ini.</p>
    </div>
  )
}
