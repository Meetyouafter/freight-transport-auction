import { Menu, MenuItem, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { AppButton } from '../AppButton/AppButton'

interface PerPageSelectProps<T extends number> {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
}

/** The "items per page" button + menu picker shared by paginated list pages. */
export function PerPageSelect<T extends number>({
  options,
  value,
  onChange,
  disabled = false,
}: PerPageSelectProps<T>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        На странице
      </Typography>
      <AppButton
        id="per-page-button"
        size="small"
        disabled={disabled}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {value}
      </AppButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: { bgcolor: 'background.paper', border: 1, borderColor: 'divider', boxShadow: 4 },
          },
          list: { 'aria-labelledby': 'per-page-button' },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === value}
            onClick={() => {
              onChange(option)
              setAnchorEl(null)
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  )
}
