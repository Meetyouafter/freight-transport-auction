import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import type { BadgePalette } from '@shared/theme/tokens'

interface StatusBadgeProps {
  palette: BadgePalette
  label: string
  icon?: ReactNode
  tone?: 'solid' | 'outline'
}

export function StatusBadge({ palette, label, icon, tone = 'solid' }: StatusBadgeProps) {
  const { bg, tint, text } = palette

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        bgcolor: tone === 'solid' ? bg : (tint ?? bg),
        border: tone === 'outline' ? '1.5px solid' : 'none',
        borderColor: text,
        color: text,
        borderRadius: '20px',
        px: '12px',
        py: '9px',
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </Box>
  )
}
