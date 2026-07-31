import { FormControlLabel, Switch } from '@mui/material'

interface SwitchFilterFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SwitchFilterField({ label, checked, onChange }: SwitchFilterFieldProps) {
  return (
    <FormControlLabel
      sx={{ ml: 0 }}
      control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />}
      label={label}
    />
  )
}
