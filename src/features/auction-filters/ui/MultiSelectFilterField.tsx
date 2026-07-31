import CheckIcon from '@mui/icons-material/Check'
import { Autocomplete, Chip, Stack, TextField } from '@mui/material'
import type { AutocompleteRenderValueGetItemProps } from '@mui/material'

function renderMultiOption(
  props: React.HTMLAttributes<HTMLLIElement> & { key: React.Key },
  label: string,
  selected: boolean,
) {
  const { key, ...rest } = props

  return (
    <li key={key} {...rest}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}
      >
        <span>{label}</span>
        {selected && <CheckIcon fontSize="small" color="primary" />}
      </Stack>
    </li>
  )
}

const singleLineTagsSx = {
  '& .MuiAutocomplete-inputRoot': {
    flexWrap: 'nowrap',
  },
  '& .MuiAutocomplete-inputRoot:not(.Mui-focused) .MuiAutocomplete-input': {
    width: 0,
    minWidth: 0,
    padding: 0,
  },
} as const

function renderLimitedTags<T extends { label: string }>(
  options: T[],
  getItemProps: AutocompleteRenderValueGetItemProps<true>,
) {
  const [first, ...rest] = options

  if (!first) return null

  return (
    <>
      <Chip size="small" label={first.label} {...getItemProps({ index: 0 })} />
      {rest.length > 0 && <Chip size="small" label={`+${rest.length}`} />}
    </>
  )
}

interface MultiSelectFilterFieldProps<T extends { value: unknown; label: string }> {
  label: string
  options: T[]
  value: T[]
  onChange: (selected: T[]) => void
}

export function MultiSelectFilterField<T extends { value: unknown; label: string }>({
  label,
  options,
  value,
  onChange,
}: MultiSelectFilterFieldProps<T>) {
  return (
    <Autocomplete
      multiple
      fullWidth
      size="small"
      disableCloseOnSelect
      sx={singleLineTagsSx}
      options={options}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      value={value}
      onChange={(_, selected) => onChange(selected)}
      renderOption={(props, option, { selected }) =>
        renderMultiOption(props, option.label, selected)
      }
      renderValue={renderLimitedTags}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  )
}
