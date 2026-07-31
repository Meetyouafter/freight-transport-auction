import { Stack, Typography } from '@mui/material'
import type { ReactElement } from 'react'

interface IconTextProps {
  icon: ReactElement
  children: React.ReactNode
}

/** A small disabled-icon + secondary-text row — the standard "meta" line used across cards/sections. */
export function IconText({ icon, children }: IconTextProps) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {children}
      </Typography>
    </Stack>
  )
}
