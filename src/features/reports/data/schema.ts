// Konstanta filter — sumber kebenaran enum mengikuti
// absensi-server/prisma/schema.prisma (AttendanceStatus, WorkMode).
import type { Granularity } from '../types/types'

export const GRANULARITY_OPTIONS: { value: Granularity; label: string }[] = [
  { value: 'monthly', label: 'Bulanan' },
  { value: 'weekly', label: 'Mingguan' },
  { value: 'range', label: 'Rentang Tanggal' },
]

// Sesuai enum AttendanceStatus di schema.prisma
export const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'PRESENT', label: 'Hadir' },
  { value: 'LATE', label: 'Terlambat' },
  { value: 'ABSENT', label: 'Tidak Hadir' },
  { value: 'SICK', label: 'Sakit' },
  { value: 'PERMIT', label: 'Izin' },
  { value: 'ON_LEAVE', label: 'Cuti' },
  { value: 'HOLIDAY', label: 'Libur' },
  { value: 'WORK_FROM_HOME', label: 'WFH' },
] as const

// Sesuai enum WorkMode di schema.prisma — WFH bukan WorkMode di backend
// (WFH = status=WORK_FROM_HOME).
export const WORK_MODE_OPTIONS = [
  { value: 'all', label: 'Semua Mode' },
  { value: 'WFO', label: 'WFO' },
  { value: 'WFA', label: 'WFA' },
] as const

export const MONTHS = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
] as const
