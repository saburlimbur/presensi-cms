import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Loader2 } from 'lucide-react'
import type { AttendanceSummary } from '../types/types'

interface Props {
  summary?: AttendanceSummary
  isLoading?: boolean
  height?: number
}

// Mapping warna per status — konsisten dengan StatusBadge di Reports table.
const STATUS_COLORS = {
  Hadir: '#10b981',
  Telat: '#f59e0b',
  Absen: '#ef4444',
  'Izin/Sakit': '#3b82f6',
  Cuti: '#8b5cf6',
  WFH: '#0ea5e9',
} as const

export function ReportsChart({ summary, isLoading, height = 320 }: Props) {
  if (isLoading) {
    return (
      <div
        className='flex items-center justify-center gap-2 text-sm text-muted-foreground'
        style={{ height }}
      >
        <Loader2 className='h-4 w-4 animate-spin' />
        Memuat data rekap…
      </div>
    )
  }

  if (!summary) {
    return (
      <div
        className='flex items-center justify-center text-sm text-muted-foreground'
        style={{ height }}
      >
        Belum ada data untuk periode ini.
      </div>
    )
  }

  const data = [
    { name: 'Hadir', value: summary.totalPresent, fill: STATUS_COLORS.Hadir },
    { name: 'Telat', value: summary.totalLate, fill: STATUS_COLORS.Telat },
    { name: 'Absen', value: summary.totalAbsent, fill: STATUS_COLORS.Absen },
    {
      name: 'Izin/Sakit',
      value: summary.totalPermit,
      fill: STATUS_COLORS['Izin/Sakit'],
    },
    { name: 'Cuti', value: summary.totalLeave, fill: STATUS_COLORS.Cuti },
    { name: 'WFH', value: summary.totalWfh, fill: STATUS_COLORS.WFH },
  ]

  return (
    <ResponsiveContainer width='100%' height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray='3 3'
          className='stroke-muted'
          vertical={false}
        />
        <XAxis
          dataKey='name'
          stroke='currentColor'
          className='text-muted-foreground'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='currentColor'
          className='text-muted-foreground'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.04)' }}
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
          formatter={(value) => [`${value} record`, 'Jumlah']}
        />
        <Bar dataKey='value' radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
