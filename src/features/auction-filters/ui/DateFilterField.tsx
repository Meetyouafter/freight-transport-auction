import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

interface DateFilterFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function DateFilterField({ label, value, onChange }: DateFilterFieldProps) {
  return (
    <DatePicker
      label={label}
      format="DD.MM.YYYY"
      value={value ? dayjs(value) : null}
      onChange={(date) => onChange(date?.isValid() ? date.format('YYYY-MM-DD') : '')}
      slotProps={{ textField: { size: 'small', fullWidth: true } }}
    />
  )
}
