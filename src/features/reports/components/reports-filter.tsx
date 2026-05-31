import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MONTHS } from '../data/schema'

type Props =
  | {
      granularity: 'monthly'
      month: number
      year: number
      onMonthChange: (m: number) => void
      onYearChange: (y: number) => void
    }
  | {
      granularity: 'weekly'
      weekStart: Date
      onWeekStartChange: (d: Date) => void
    }
  | {
      granularity: 'range'
      from: Date
      to: Date
      onFromChange: (d: Date) => void
      onToChange: (d: Date) => void
    }

export function ReportsFilter(props: Props) {
  if (props.granularity === 'monthly') {
    return <MonthlySelector {...props} />
  }
  if (props.granularity === 'weekly') {
    return <WeeklySelector {...props} />
  }
  return <RangeSelector {...props} />
}

function MonthlySelector({
  month,
  year,
  onMonthChange,
  onYearChange,
}: {
  month: number
  year: number
  onMonthChange: (m: number) => void
  onYearChange: (y: number) => void
}) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i)

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Select
        value={String(month)}
        onValueChange={(v) => onMonthChange(Number(v))}
      >
        <SelectTrigger size='sm' className='w-[140px]'>
          <SelectValue placeholder='Bulan' />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={String(m.value)}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={String(year)}
        onValueChange={(v) => onYearChange(Number(v))}
      >
        <SelectTrigger size='sm' className='w-[100px]'>
          <SelectValue placeholder='Tahun' />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function WeeklySelector({
  weekStart,
  onWeekStartChange,
}: {
  weekStart: Date
  onWeekStartChange: (d: Date) => void
}) {
  return (
    <DatePickerButton
      label='Mulai Minggu'
      value={weekStart}
      onChange={onWeekStartChange}
    />
  )
}

function RangeSelector({
  from,
  to,
  onFromChange,
  onToChange,
}: {
  from: Date
  to: Date
  onFromChange: (d: Date) => void
  onToChange: (d: Date) => void
}) {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <DatePickerButton label='Dari' value={from} onChange={onFromChange} />
      <span className='text-xs text-muted-foreground'>→</span>
      <DatePickerButton
        label='Sampai'
        value={to}
        onChange={onToChange}
        minDate={from}
      />
    </div>
  )
}

function DatePickerButton({
  label,
  value,
  onChange,
  minDate,
}: {
  label: string
  value: Date
  onChange: (d: Date) => void
  minDate?: Date
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='w-[160px] justify-start gap-2 font-normal'
        >
          <CalendarIcon className='h-3.5 w-3.5 opacity-60' />
          <span className='text-xs text-muted-foreground'>{label}:</span>
          <span className='text-xs'>{format(value, 'dd MMM yyyy')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          captionLayout='dropdown'
          selected={value}
          onSelect={(d) => d && onChange(d)}
          disabled={(date: Date) => {
            if (date > new Date()) return true
            if (minDate && date < minDate) return true
            return false
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { MONTHS }
